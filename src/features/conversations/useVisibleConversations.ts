import { useMemo } from 'react'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'
import { CURRENT_USER_ID } from '@/lib/constants'
import { useAppSelector } from '@/store/hooks'
import type { Conversation, Message } from '@/types'
import { getConversationDisplay } from '@/features/conversations/conversationDisplay'

export interface VisibleConversation {
  conversation: Conversation
  name: string
  avatarUrl: string
  isOnline?: boolean
  lastMessage?: Message
}

/**
 * Applies the search query and the All/Unread/Groups filter to the raw
 * conversation list, and sorts by most recent activity. The search string
 * is debounced here (not in the input) so the text field itself never lags
 * while the filtering work is deferred.
 */
export function useVisibleConversations(): VisibleConversation[] {
  const conversations = useAppSelector((state) => state.conversations.conversations)
  const filter = useAppSelector((state) => state.conversations.filter)
  const searchQuery = useAppSelector((state) => state.conversations.searchQuery)
  const debouncedQuery = useDebouncedValue(searchQuery.trim().toLowerCase(), 250)
  const users = useAppSelector((state) => state.users.users)
  const messagesByConversation = useAppSelector((state) => state.messages.messagesByConversation)

  return useMemo(() => {
    const enriched = conversations.map((conversation) => {
      const display = getConversationDisplay(conversation, users, CURRENT_USER_ID)
      const messages = messagesByConversation[conversation.id] ?? []
      const lastMessage = messages[messages.length - 1]
      return { conversation, name: display.name, avatarUrl: display.avatarUrl, isOnline: display.isOnline, lastMessage }
    })

    const filtered = enriched.filter(({ conversation, name, lastMessage }) => {
      if (filter === 'unread' && conversation.unreadCount === 0) return false
      if (filter === 'groups' && conversation.type !== 'group') return false

      if (debouncedQuery.length > 0) {
        const matchesName = name.toLowerCase().includes(debouncedQuery)
        const matchesLastMessage = lastMessage?.text.toLowerCase().includes(debouncedQuery) ?? false
        if (!matchesName && !matchesLastMessage) return false
      }

      return true
    })

    return filtered.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt ?? a.conversation.createdAt
      const bTime = b.lastMessage?.createdAt ?? b.conversation.createdAt
      return bTime.localeCompare(aTime)
    })
  }, [conversations, users, messagesByConversation, filter, debouncedQuery])
}
