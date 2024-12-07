import { db } from '~/drizzle'

async function getChat(id: string) {
  const chat = await db.query.chats.findFirst({
    where: (c, { eq }) => eq(c.id, id),
    with: {
      messages: {
        where: (m, { eq, or }) =>
          or(eq(m.role, 'assistant'), eq(m.role, 'user')),
        orderBy: (m, { asc }) => asc(m.createdAt),
        with: {
          sources: {
            columns: {
              url: true,
              docType: true,
              title: true,
              match: true,
            },
          },
        },
      },
    },
  })

  return chat || null
}

export type Chat = Awaited<ReturnType<typeof getChat>>

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const chat = await getChat(id)

  return Response.json(chat)
}
