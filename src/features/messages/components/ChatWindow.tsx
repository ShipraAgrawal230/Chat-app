import { MessagesSquare } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAppSelector } from '@/store/hooks'
import { ChatHeader } from '@/features/messages/components/ChatHeader'
import { MessageInput } from '@/features/messages/components/MessageInput'
import { MessageList } from '@/features/messages/components/MessageList'

interface ChatWindowProps {
  isMobile: boolean
}

export function ChatWindow({ isMobile }: ChatWindowProps) {
  const activeConversationId = useAppSelector((state) => state.ui.activeConversationId)
  const conversation = useAppSelector((state) =>
    state.conversations.conversations.find((c) => c.id === activeConversationId),
  )

  if (!conversation) {
    return (
      <div className="flex h-full flex-col">
        <EmptyState icon={MessagesSquare} title="Select a conversation" description="Choose a chat from the list to start messaging." />
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <ChatHeader conversation={conversation} showBackButton={isMobile} />
      <MessageList conversation={conversation} />
      <MessageInput conversationId={conversation.id} />
    </div>
  )
}
