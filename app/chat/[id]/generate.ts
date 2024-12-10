'use server'

import type { CoreMessage } from 'ai'
import type { DocType } from '~/resources'
import { auth } from '@clerk/nextjs/server'
import { embed, generateObject, streamText } from 'ai'
import { createStreamableValue } from 'ai/rsc'
import { and, cosineDistance, desc, eq, gt, inArray, sql } from 'drizzle-orm'
import { z } from 'zod'
import { chatsMessages, chatsMessagesSources, db, docs } from '~/drizzle'
import { models } from '~/lib/ai'
import { createLogger } from '~/lib/logger'
import { zodEnum } from '~/lib/zod'
import { resources } from '~/resources'
import { isSubscriptionActive } from '~/trpc/utils/subscription'

const logger = createLogger('chat.generate')

export interface StreamableResult {
  text: string
  finished: boolean
  sources: Omit<typeof chatsMessagesSources.$inferSelect, 'id' | 'chatMessageId'>[]
}

const validationSchema = z.object({
  question: z.string(),
  chatId: z.string().uuid(),
  docType: z.enum(zodEnum(resources.map(resource => resource.type))).nullable(),
  refreshAnswer: z.boolean(),
})

async function getChat(chatId: string, userId: string) {
  const chat = await db.query.chats.findFirst({
    where: (c, { and, eq }) => and(eq(c.id, chatId), eq(c.userId, userId)),
    with: {
      messages: {
        orderBy: (m, { asc }) => asc(m.createdAt),
        columns: {
          id: true,
          role: true,
          content: true,
          docTypes: true,
        },
      },
    },
  })

  if (!chat) {
    return null
  }

  return {
    ...chat,
    // system and first user message can be in any order due to same timestamp
    messages: chat.messages.toSorted((a, b) => a.role === 'system' ? -1 : b.role === 'system' ? 1 : 0),
  }
}

async function prepareChatMessages(chat: NonNullable<Awaited<ReturnType<typeof getChat>>>, validatedData: z.infer<typeof validationSchema>) {
  // If refreshAnswer we should remove last assistant message if exist to left user message as last
  if (validatedData.refreshAnswer) {
    const lastMessage = chat.messages.at(-1)!

    if (lastMessage.role === 'assistant') {
      await db.delete(chatsMessages).where(eq(chatsMessages.id, lastMessage.id))
      chat.messages.pop()
    }
  }
  // default flow if user asking something we should save the message
  else {
    const userMessage = {
      role: 'user',
      content: validatedData.question,
      chatId: chat.id,
      docTypes: validatedData.docType ? [validatedData.docType] : [],
    } satisfies typeof chatsMessages.$inferInsert

    const [{ id }] = await db.insert(chatsMessages).values(userMessage).returning({ id: chatsMessages.id })
    chat.messages.push({ ...userMessage, id })
  }
}

async function findDocs({ question, messages, docType }: { question: string, messages: CoreMessage[], docType: DocType | null }) {
  const prompt = `
    General info:
    - You are a tool who accepts questions from a user related to JavaScript or TypeScript frameworks or libraries
    - Your task is to get the sense of the question user asking and make it less verbose
    - Generated answer we will transform to embedding and send to our vector db to find the most similar documentation
    ${docType ? `- User choose ${resources.find(r => r.type === docType)!.label} in the chat filter` : ''}

    Answer generation rules:
    - Answer should be short to find the most similar documentation in our vector db
    - Avoid phrases that doesn't affect the sense of the question, such as "how to", "what is", "how to do", etc
    - Do not transform and do not concat any parts of the question related to code, especially if it's method name, examples of incorrect behavior:
    'use client' -> useClient, defineExpose -> define expose.
    - Do not change phases, example: newest -> latest
    - Take into account all user messages
    - If user ask not in English, translate the question to English but still use rules before
    - Remove all doc types from the answer

    DocType generation rules:
    - Generate doc types array that answer EXACTLY is related to, example of incorrect answer: ['react'] if user asking about 'react-router', 'redux', etc.
    - Set empty array, if answer is not related to any existed doc type in our list: ${resources.map(r => r.type).join(', ')}.
  `.trim()

  const { object } = await generateObject({
    model: models.question,
    messages: [
      {
        role: 'system',
        content: prompt,
      },
      ...messages.filter(m => m.role !== 'system'),
      {
        role: 'user',
        content: question.trim(),
      },
    ],
    temperature: 0.1,
    schema: z.object({
      answer: z.string().describe('Generated answer without doc types'),
      docTypes: z
        .array(z.string() as z.ZodType<DocType>)
        .describe('List of doc types that answer EXACTLY is related to'),
    }),
  })

  // even with our instructions AI sometimes returns doc types in the answer
  resources.forEach((resource) => {
    object.answer = object.answer.toLowerCase()
      .replaceAll(resource.label.toLowerCase(), '')
      .replaceAll(resource.type.toLowerCase(), '')
      .trim()
  })

  // AI in some cases returns empty string and resources that we do not have
  if (!Array.isArray(object.docTypes)) {
    object.docTypes = []
  }

  object.docTypes = object.docTypes.filter(t => resources.find(r => r.type === t))

  object.answer = object.answer.trim() || docType || object.docTypes.join(', ') || ''

  if (!object.answer) {
    logger.error('Generated answer is empty', { question, object })
    return {
      docs: [],
    }
  }

  logger.info(`Embedding answer: "${object.answer}" with doc types: "${object.docTypes.join(', ') || 'none'}"`)

  const { embedding } = await embed({
    model: models.embedding,
    value: object.answer,
  })

  const similarity = sql<number>`1 - (${cosineDistance(
    docs.embedding,
    embedding,
  )})`

  const foundSections = await db
    .select({
      similarity,
      path: docs.path,
    })
    .from(docs)
    .where(
      and(
        gt(similarity, 0.3),
        inArray(docs.type, docType ? [docType] : object.docTypes),
      ),
    )

  const paths = [...new Set(foundSections.flat().map(doc => doc.path))]

  return {
    docs: await db
      .select({
        similarity,
        id: docs.id,
        path: docs.path,
        type: docs.type,
        title: docs.title,
        content: docs.content,
        url: docs.url,
        index: docs.index,
      })
      .from(docs)
      .where(inArray(docs.path, paths))
      .limit(40)
      .orderBy(t => desc(t.similarity)),
  }
}

export async function generate(data: z.infer<typeof validationSchema>) {
  const { userId } = await auth()

  if (!userId) {
    throw new Error('Unauthorized')
  }

  const isActive = await isSubscriptionActive(userId)

  if (!isActive) {
    throw new Error('User has no active subscription')
  }

  const validatedData = await validationSchema.parseAsync(data)

  const chat = await getChat(validatedData.chatId, userId)

  if (!chat) {
    throw new Error('Chat not found')
  }

  await prepareChatMessages(chat, validatedData)

  const userMessage = chat.messages.at(-1)!

  // if the last message isn't from user, throw error
  if (userMessage.role !== 'user') {
    throw new Error('Last message is not from user')
  }

  const userDoc = resources.find(r => r.type === userMessage.docTypes[0]) ?? null

  logger.info(`Searching for docs for question: "${userMessage.content}" and doc type: "${userDoc?.type ?? 'none'}"`)

  const { docs } = await findDocs({
    messages: chat.messages,
    question: userMessage.content,
    docType: userDoc?.type ?? null,
  })

  logger.info(`Found ${docs.length} docs`)

  chat.messages[0].content += `\n\n
    Request info:
    - current time is ${new Date().toLocaleString()}`

  if (userDoc) {
    chat.messages[0].content += `
    - user selected ${userDoc.type} in the docs filter on chat page, any user question related to this doc
    - if asking doc different from ${userDoc.type}, do not answer and tell the user to change the doc in the asking form if it exists
    `.trim()
  }

  if (docs.length) {
    chat.messages[0].content += `
    - use the following information from the our database as reference to answer the question that user asked with maximum details
    - add more links from the found sections to the answer
    - show as many code snippets from the sections below as possible

    Supabase vector database found the following information, use these sections to answer the question (JSON array of objects):
    =======================
    ${JSON.stringify(docs.map(d => ({
      id: d.id,
      docType: d.type,
      similarity: d.similarity,
      url: d.url,
      content: d.content,
    })), null, 2)}
    `.trim()
  }
  else {
    chat.messages[0].content += `
    - Supabase vector database didn't find any information about user question.
    - Answer the question based on your general knowledge.
    - You can generate code in 2 cases:
      1. user asks for it
      2. you 100% sure about generated code because it's from the official docs
    `.trim()
  }

  const stream = createStreamableValue<StreamableResult>({
    text: '',
    finished: false,
    sources: [],
  })

  ;(async () => {
    try {
      const { textStream, text: textPromise } = streamText({
        model: docs.length ? models.answer.docs : models.answer.noDocs,
        messages: chat.messages,
        temperature: 0.4,
        experimental_continueSteps: true,
      })

      for await (const textPart of textStream) {
        stream.update({
          text: textPart,
          sources: [],
          finished: false,
        })
      }

      const text = await textPromise

      stream.update({
        text,
        sources: [],
        finished: true,
      })

      logger.info('Text stream finished')

      const sources = [...new Map(docs.map((doc) => {
        const biggestSimilarity = Math.max(
          ...docs
            .filter(d => d.path === doc.path)
            .map(d => d.similarity),
        )

        return [doc.url, {
          url: doc.url,
          docType: doc.type,
          title: doc.title,
          match: Math.min(+(Math.round(biggestSimilarity * 100) * 1.2).toFixed(), 100), // 1.2 just for illusion of better match
        } satisfies StreamableResult['sources'][number]]
      })).values()]

      const { messageId } = await db.transaction(async (db) => {
        const [{ id }] = await db.insert(chatsMessages).values({
          role: 'assistant',
          content: text,
          chatId: chat.id,
        }).returning({ id: chatsMessages.id })
        logger.success(`Message ${id} saved`)

        if (sources.length) {
          await db.insert(chatsMessagesSources).values(sources.map(source => ({
            ...source,
            chatMessageId: id,
          })))
          logger.success(`${sources.length} sources saved in message`, id)
        }

        return { messageId: id }
      })

      logger.success(`Chat message saved`, messageId)

      stream.done({
        text,
        sources,
        finished: true,
      })
    }
    catch (e) {
      logger.fatal(`Error while generating answer`, e)
      throw new Error('Something went wrong')
    }
  })()

  return { object: stream.value }
}
