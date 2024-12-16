'use client'

import type { StreamableResult } from './generate'
import type { chatMessageRole } from '~/drizzle'
import type { DocType } from '~/resources'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { RiFileCopyLine, RiRefreshLine } from '@remixicon/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { readStreamableValue } from 'ai/rsc'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { ChatAssistant, ChatContainer, ChatUser } from '~/components/chat-messages'
import { Markdown } from '~/components/markdown'
import { pushModal } from '~/components/modals'
import { Button } from '~/components/ui/button'
import { UserAvatar } from '~/components/user-avatar'
import { useCopy } from '~/hooks/use-copy'
import { useUser } from '~/hooks/use-user'
import { chatQuery } from '~/lib/query-keys'
import { cn, scrollTo } from '~/lib/ui'
import chatAnimation from '~/lottie/chat.json'
// import { SandboxWrapper } from '../components/sandbox-wrapper'
import { QuestionForm } from '../components/question-form'
import { CHAT_CONTAINER_WIDTH_CLASS } from '../lib/constants'
import { useSidebarContext } from '../sidebar'
import { ChatHeader } from './components/header'
import { ChatSource } from './components/source'
import { generate } from './generate'

const loadingMessages = Array.from({ length: 6 }).map((_, i) => ({ id: i + 1, role: i % 2 === 0 ? 'user' : 'assistant' }))

// Prevent double submission in strict mode
let isLoaded = false

interface Message {
  id: string
  role: typeof chatMessageRole.enumValues[number]
  content: string
  sources: StreamableResult['sources']
}

// Sometimes `generate` takes more than 15 seconds, so we need to increase the max duration
// https://vercel.com/docs/functions/runtimes#max-duration
export const maxDuration = 300

export default function Chat() {
  const queryClient = useQueryClient()
  const t = useTranslations('views.chat')
  const tLabels = useTranslations('labels')
  const { copyToClipboard } = useCopy()
  const { id } = useParams<{ id: string }>()
  const { closeTab } = useSidebarContext()
  const { user } = useUser()
  const [docType, setDocType] = useState<DocType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState<unknown | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [generatedText, setGeneratedText] = useState('')
  const { data: chat, error: chatError, isLoading: chatIsLoading } = useQuery(chatQuery(id))
  const router = useRouter()
  const fieldRef = useRef<HTMLTextAreaElement>(null)
  const isShared = !!chat && chat.user.id !== user?.id

  const focus = () => fieldRef.current?.focus()

  useEffect(() => {
    focus()

    window.addEventListener('focus', focus)

    return () => {
      window.removeEventListener('focus', focus)
      isLoaded = false
    }
  }, [])

  async function submit(refreshAnswer: boolean) {
    'use no memo'

    setTimeout(() => {
      scrollTo(document.body.scrollHeight)
    }, 0)

    setIsLoading(true)
    setError(null)

    if (refreshAnswer) {
      setMessages(messages => messages.at(-1)?.role === 'assistant' ? messages.slice(0, -1) : messages)
    }
    else {
      setMessages(messages => [
        ...messages,
        {
          id: crypto.randomUUID(),
          role: 'user',
          content: input,
          sources: [],
        },
      ])
      setInput('')
    }

    try {
      const { object } = await generate({
        refreshAnswer,
        chatId: id,
        question: input,
        docType,
      })

      let result: StreamableResult | null = null

      for await (const part of readStreamableValue(object)) {
        if (!part) {
          continue
        }

        if (part.text) {
          setIsLoading(false)
        }

        if (part.finished) {
          result = part
        }
        else {
          setGeneratedText(prev => prev + part.text)
        }
      }

      if (!result) {
        throw new Error('No result')
      }

      setGeneratedText('')
      setMessages(messages => [
        ...messages,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: result.text,
          sources: result.sources,
        },
      ])
      focus()
      queryClient.invalidateQueries(chatQuery(id))
    }
    catch (e) {
      setError(e)
      setGeneratedText('')
    }
    finally {
      setIsLoading(false)
    }
  }

  function chatLoaded() {
    if (!chat || isLoaded) {
      return
    }

    isLoaded = true

    focus()
    setMessages(chat.messages)

    if (!isShared) {
      setTimeout(() => {
        scrollTo(document.body.scrollHeight)
      }, 0)
    }

    const lastUserResource = chat.messages.findLast(m => m.role === 'user')?.docTypes?.[0] ?? null

    if (lastUserResource) {
      setDocType(lastUserResource)
    }

    const lastMessage = chat.messages.at(-1)

    if (lastMessage!.role === 'user') {
      submit(true)
    }
  }

  useEffect(() => {
    chatLoaded()
  }, [chat])

  useEffect(() => {
    if (chatError) {
      toast.error(t('chat-not-found'))
      router.push('/chat')
    }
  }, [chatError])

  async function generateAgain() {
    pushModal('Confirm', {
      text: t('generate-confirm'),
      onConfirm: () => {
        submit(true)
      },
    })
  }

  return (
    // <SandboxWrapper>
    <div
      className="flex min-h-screen w-full flex-col justify-between px-4"
      onClick={closeTab}
    >
      <div>
        <ChatHeader isShared={isShared} chat={chat} className="mb-10" />
        <ChatContainer className="pb-10">
          {!chat
            ? loadingMessages.map(message => (
                <Fragment key={message.id}>
                  {message.role === 'user' && <ChatUser skeleton />}
                  {message.role === 'assistant' && <ChatAssistant skeleton />}
                </Fragment>
              ))
            : messages.map(message => (
                <Fragment key={message.id}>
                  {message.role === 'user' && (
                    <ChatUser
                      id={message.id}
                      avatar={(
                        <UserAvatar
                          user={chat.user}
                          className="size-full rounded-none"
                        />
                      )}
                    >
                      <Markdown content={message.content} />
                      {/* {!isShared && (
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="xs"
                          onClick={() => copyToClipboard(message.content)}
                        >
                          <RiFileCopyLine className="size-3" />
                          {tLabels('copy')}
                        </Button>
                      </div>
                    )} */}
                    </ChatUser>
                  )}
                  {message.role === 'assistant' && (
                    <ChatAssistant id={message.id}>
                      <Markdown content={message.content} />
                      {!isShared && messages.at(-1)?.id === message.id && (
                        <div className="mt-4 flex gap-2">
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => copyToClipboard(message.content)}
                          >
                            <RiFileCopyLine className="size-3" />
                            {tLabels('copy')}
                          </Button>
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={generateAgain}
                          >
                            <RiRefreshLine className="size-3" />
                            {t('generate-again')}
                          </Button>
                        </div>
                      )}
                      {!!message.sources.length && (
                        <div>
                          <h4 className="mb-2 mt-6 text-sm text-gray-500">{t('sources')}</h4>
                          <div className="flex gap-2 overflow-x-auto">
                            {message.sources.map(source => (
                              <ChatSource key={source.url} source={source} />
                            ))}
                          </div>
                        </div>
                      )}
                    </ChatAssistant>
                  )}
                </Fragment>
              ))}
          {(isLoading || !!generatedText) && (
            <ChatAssistant avatarClassName="bg-transparent dark:bg-transparent animate-pulse">
              {!!generatedText && <Markdown className="mb-6" content={generatedText} animated />}
              {isLoading && (
                <span className="prose flex animate-pulse items-end">
                  {t('searching')}
                  <DotLottieReact
                    autoplay
                    loop
                    className="size-5 translate-y-0.5 opacity-40"
                    data={chatAnimation}
                  />
                </span>
              )}
            </ChatAssistant>
          )}
          {!!error && (
            <ChatAssistant avatarClassName="border-red-200 bg-transparent dark:bg-transparent dark:border-red-900  text-red-400 dark:text-red-800">
              <div className="flex flex-col items-start gap-4">
                <span className="prose flex items-end text-red-500 dark:text-red-700">
                  {t('error')}
                </span>
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => submit(true)}
                >
                  <RiRefreshLine className="size-3" />
                  {t('try-again')}
                </Button>
              </div>
            </ChatAssistant>
          )}
        </ChatContainer>
      </div>
      {!!user && !isShared && (
        <QuestionForm
          ref={fieldRef}
          className={cn('sticky bottom-2 mx-auto w-full', CHAT_CONTAINER_WIDTH_CLASS)}
          input={input}
          setInput={setInput}
          docType={docType}
          setDocType={setDocType}
          handleSubmit={() => submit(false)}
          disabled={isLoading || chatIsLoading}
          loading={isLoading}
        />
      )}
    </div>
    // </SandboxWrapper>
  )
}
