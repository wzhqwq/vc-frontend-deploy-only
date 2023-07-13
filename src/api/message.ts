import { Message } from '@/types/entity/message'
import { useErrorlessQuery, useDelete } from './common'
import { queryClient } from './queryClient'
import { useCallback } from 'react'

export function useMessages(unreadOnly: boolean) {
  const { data: messages, isFetching: fetchingMessages } = useErrorlessQuery<Message[]>(
    {
      queryKey: unreadOnly
        ? ['private', 'user', 'messages', 'unread']
        : ['private', 'user', 'messages'],
    },
    '获取消息列表',
  )
  const { mutate: setReadAllMessages, isLoading: settingReadAllMessages } = useDelete(
    ['private', 'user', 'messages'],
    '将所有消息设为已读',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'user', 'messages'])
      },
    },
  )

  return {
    messages,
    fetchingMessages,

    setReadAllMessages: useCallback(() => setReadAllMessages(undefined), []),
    settingReadAllMessages,
  }
}

export function useMessage(messageId: number, enabled = true) {
  const { data: message, isFetching: fetchingMessage } = useErrorlessQuery<Message>(
    {
      queryKey: ['private', 'user', 'messages', messageId],
      enabled,
    },
    '获取消息',
  )
  const { mutate: setReadMessage, isLoading: settingReadMessage } = useDelete(
    ['private', 'user', 'messages', messageId],
    '将消息设为已读',
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['private', 'user', 'messages'])
      },
    },
  )

  return {
    message,
    fetchingMessage,

    setReadMessage: useCallback(() => setReadMessage(undefined), []),
    settingReadMessage,
  }
}
