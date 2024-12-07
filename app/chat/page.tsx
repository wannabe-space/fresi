'use client'

import type { TRPCError } from '@trpc/server'
import type { DocType } from '~/resources'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useSubscriptionAlert } from '~/hooks/use-subscription-alert'
import { useUser } from '~/hooks/use-user'
import { REPOSITORY_URL } from '~/lib/constants'
import { chatCreateMutation, chatsListQuery, subscriptionCheckQuery } from '~/lib/query-keys'
import { cn } from '~/lib/ui'
import { Available } from './components/available'
import { QuestionForm } from './components/question-form'
import { CHAT_CONTAINER_WIDTH_CLASS } from './lib/constants'
import { SidebarTrigger } from './sidebar'

// Prevent double submission in strict mode
let isSubmitting = false

export default function ChatPage() {
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const t = useTranslations('views.chat')
  const tApp = useTranslations('app')
  const [input, setInput] = useState(searchParams.get('question') || '')
  const [docType, setDocType] = useState<DocType | null>(searchParams.get('doc') as DocType || null)
  const router = useRouter()
  const fieldRef = useRef<HTMLTextAreaElement>(null)
  const { user } = useUser()
  const { data: isActiveSubscription } = useQuery(subscriptionCheckQuery())

  useSubscriptionAlert()

  const { mutateAsync, isPending } = useMutation(chatCreateMutation(input, docType))

  async function submit(question: string) {
    if (isSubmitting)
      return

    isSubmitting = true
    try {
      const { id } = await mutateAsync({ question })

      queryClient.invalidateQueries(chatsListQuery())

      router.push(`/chat/${id}`)
    }
    catch (error) {
      toast.error((error as TRPCError).message)
    }
    finally {
      isSubmitting = false
    }
  }

  async function handleSubmit() {
    if (!isActiveSubscription) {
      toast.error(tApp('subscription-required'))
      router.push('/home')
      return
    }

    await submit(input)
  }

  async function handleQueryParams() {
    if (searchParams.get('question')) {
      await submit(searchParams.get('question')!)
    }
  }

  useEffect(() => {
    handleQueryParams()
    fieldRef.current?.focus()
  }, [])

  const improvementsNotice = tApp.markup('improvements-notice', {
    a: chunks => `<a href="${REPOSITORY_URL}/issues" target="_blank" class="underline">${chunks}</a>`,
  })
  const signIn = t.markup('sign-in', {
    a: chunks => `<a href="/sign-in" class="underline underline-offset-2 mx-0.5">${chunks}</a>`,
  })

  return (
    <div className={cn('mx-auto px-4 flex min-h-screen w-full flex-col justify-between py-10', CHAT_CONTAINER_WIDTH_CLASS)}>
      <SidebarTrigger className="absolute left-2 top-2 mt-2" />
      {user
        ? <div />
        : <div className="my-5 text-balance text-center text-sm" dangerouslySetInnerHTML={{ __html: signIn }} />}
      <div className="flex flex-col justify-center">
        <h1 className="mb-10 bg-gradient-to-r from-zinc-800 to-primary bg-clip-text text-center text-h3 font-semibold text-transparent dark:from-white dark:to-primary">
          {t('title')}
        </h1>
        <QuestionForm
          ref={fieldRef}
          className="sticky bottom-0 mb-10"
          input={input}
          setInput={setInput}
          docType={docType}
          setDocType={setDocType}
          handleSubmit={handleSubmit}
          disabled={isPending}
          loading={isPending}
        />
        <Available
          setDocType={(t) => {
            setDocType(t)
            fieldRef.current?.focus()
          }}
        />
      </div>
      <div
        className="mx-auto mt-10 max-w-sm text-balance text-center text-sm opacity-30"
        dangerouslySetInnerHTML={{ __html: improvementsNotice }}
      />
    </div>
  )
}
