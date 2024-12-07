import type { MutationOptions, QueryOptions } from '@tanstack/react-query'
import type { subscriptionType } from '~/drizzle'
import type { DocType } from '~/resources'
import { trpc } from '~/trpc/client'

export function profileQuery() {
  return {
    queryKey: ['profile.get'],
    queryFn: () => trpc.profile.get.query(),
  } satisfies QueryOptions
}

export function chatQuery(id: string) {
  return {
    queryKey: ['chats.get', id],
    queryFn: () => trpc.chats.get.query({ id }),
  } satisfies QueryOptions
}

export function chatsListQuery() {
  return {
    queryKey: ['chats.list'],
    queryFn: ({ pageParam = 0 }: { pageParam?: number }) => trpc.chats.list.query({ offset: pageParam }),
    initialPageParam: 0,
  }
}

export function subscriptionCheckQuery() {
  return {
    queryKey: ['subscriptions.check'],
    queryFn: () => trpc.subscriptions.check.query(),
  } satisfies QueryOptions
}

export function subscriptionManageMutation() {
  return {
    mutationKey: ['subscriptions.manage'],
    mutationFn: ({ type }) => trpc.subscriptions.manage.mutate({ type }),
  } satisfies MutationOptions<unknown, unknown, { type: typeof subscriptionType.enumValues[number] }>
}

export function chatCreateMutation(question: string, docType: DocType | null) {
  return {
    mutationKey: ['chats.create', question, docType],
    mutationFn: ({ question }) => trpc.chats.create.mutate({ docType, question }),
  } satisfies MutationOptions<unknown, unknown, { question: string }>
}

export function chatVisibilityMutation({ id }: { id: string }) {
  return {
    mutationKey: ['chats.visibility', id],
    mutationFn: ({ isPublic }) => trpc.chats.visibility.mutate({ chatId: id, isPublic }),
  } satisfies MutationOptions<unknown, unknown, { isPublic: boolean }>
}
