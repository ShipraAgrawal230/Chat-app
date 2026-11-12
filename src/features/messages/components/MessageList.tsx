import { useRef } from 'react'
import { MessageCircle } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { useAppSelector } from '@/store/hooks'
import type { Conversation, Message } from '@/types'
import { useAutoScroll } from '@/features/messages/useAutoScroll'
import { useMessageGroups } from '@/features/messages/useMessageGroups'
import { MessageBubble } from '@/features/messages/components/MessageBubble'
import { MessageDateDivider } from '@/features/messages/components/MessageDateDivider'
import { TypingIndicator } from '@/features/messages/components/TypingIndicator'

interface MessageListProps {
  conversation: Conversation
}

const NO_MESSAGES: Message[] = []

export function MessageList({ conversation }: MessageListProps) {
  const messages = useAppSelector((state) => state.messages.messagesByConversation[conversation.id])
  const containerRef = useRef<HTMLDivElement>(null)
  const groups = useMessageGroups(messages ?? NO_MESSAGES)

  useAutoScroll(containerRef, { conversationId: conversation.id, messageCount: messages?.length ?? 0 })

  if (messages === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1">
        <EmptyState icon={MessageCircle} title="No messages yet" description="Send the first message to start the conversation." />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="scrollbar-thin flex-1 overflow-y-auto py-2">
      {groups.map((group) => (
        <div key={group.dateKey}>
          <MessageDateDivider label={group.label} />
          {group.messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              showSenderIdentity={conversation.type === 'group' && group.messages[index - 1]?.senderId !== message.senderId}
            />
          ))}
        </div>
      ))}
      <TypingIndicator conversationId={conversation.id} />
    </div>
  )
}
