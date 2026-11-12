import { MessageSquareOff } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { markedAsRead } from '@/store/conversationsSlice'
import { loadMessages } from '@/store/messagesSlice'
import { conversationSelected } from '@/store/uiSlice'
import { useVisibleConversations } from '@/features/conversations/useVisibleConversations'
import { ConversationListItem } from '@/features/conversations/components/ConversationListItem'

export function ConversationList() {
  const dispatch = useAppDispatch()
  const status = useAppSelector((state) => state.conversations.status)
  const activeConversationId = useAppSelector((state) => state.ui.activeConversationId)
  const visibleConversations = useVisibleConversations()

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (visibleConversations.length === 0) {
    return <EmptyState icon={MessageSquareOff} title="No conversations found" description="Try a different search or filter." />
  }

  return (
    <ul className="scrollbar-thin flex-1 space-y-0.5 overflow-y-auto px-2 py-2" aria-label="Conversations">
      {visibleConversations.map((item) => (
        <li key={item.conversation.id}>
          <ConversationListItem
            item={item}
            isActive={item.conversation.id === activeConversationId}
            onSelect={() => {
              dispatch(conversationSelected(item.conversation.id))
              dispatch(markedAsRead(item.conversation.id))
              void dispatch(loadMessages(item.conversation.id))
            }}
          />
        </li>
      ))}
    </ul>
  )
}
