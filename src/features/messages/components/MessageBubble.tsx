import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/cn'
import { CURRENT_USER_ID } from '@/lib/constants'
import { formatMessageTime } from '@/lib/formatDate'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { deleteMessage, editMessage, reactionToggled } from '@/store/messagesSlice'
import { editingMessageChanged, replyTargetChanged } from '@/store/uiSlice'
import type { Message } from '@/types'
import { DeliveryStatusIcon } from '@/features/messages/components/DeliveryStatusIcon'
import { MessageActionsMenu } from '@/features/messages/components/MessageActionsMenu'
import { MessageEditForm } from '@/features/messages/components/MessageEditForm'
import { MessageReactions } from '@/features/messages/components/MessageReactions'
import { MessageReplyQuote } from '@/features/messages/components/MessageReplyQuote'

interface MessageBubbleProps {
  message: Message
  /** Whether to show the sender's avatar/name (group chats, non-own messages only). */
  showSenderIdentity: boolean
}

export function MessageBubble({ message, showSenderIdentity }: MessageBubbleProps) {
  const dispatch = useAppDispatch()
  const isOwnMessage = message.senderId === CURRENT_USER_ID
  const sender = useAppSelector((state) => state.users.users.find((user) => user.id === message.senderId))
  const repliedMessage = useAppSelector((state) =>
    message.replyToId
      ? state.messages.messagesByConversation[message.conversationId]?.find((m) => m.id === message.replyToId)
      : undefined,
  )

  const editingMessageId = useAppSelector((state) => state.ui.editingMessageId)
  const isEditing = editingMessageId === message.id
  const align = isOwnMessage ? 'end' : 'start'

  async function handleDelete() {
    if (window.confirm('Delete this message?')) {
      await dispatch(deleteMessage({ conversationId: message.conversationId, messageId: message.id }))
    }
  }

  return (
    <div className={cn('group flex gap-2 px-4 py-1', isOwnMessage ? 'justify-end' : 'justify-start')}>
      {!isOwnMessage && (
        <div className="w-8 shrink-0">
          {showSenderIdentity && sender && <Avatar src={sender.avatarUrl} name={sender.name} size="sm" />}
        </div>
      )}

      <div className={cn('relative flex max-w-[70%] flex-col', isOwnMessage ? 'items-end' : 'items-start')}>
        {showSenderIdentity && !isOwnMessage && sender && (
          <span className="mb-0.5 px-1 text-xs font-medium text-slate-500 dark:text-slate-400">{sender.name}</span>
        )}

        <div
          className={cn(
            'rounded-2xl px-3 py-2 text-sm',
            isOwnMessage
              ? 'rounded-br-sm bg-emerald-600 text-white'
              : 'rounded-bl-sm bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
          )}
        >
          {message.replyToId && <MessageReplyQuote repliedMessage={repliedMessage} />}

          {isEditing ? (
            <MessageEditForm
              initialText={message.text}
              onCancel={() => dispatch(editingMessageChanged(null))}
              onSave={(text) => {
                void dispatch(editMessage({ conversationId: message.conversationId, messageId: message.id, text }))
                dispatch(editingMessageChanged(null))
              }}
            />
          ) : (
            <p className="whitespace-pre-wrap break-words">{message.text}</p>
          )}

          <div className={cn('mt-1 flex items-center gap-1 text-[11px]', isOwnMessage ? 'text-emerald-100' : 'text-slate-400')}>
            {message.editedAt && <span className="italic">edited</span>}
            <span>{formatMessageTime(message.createdAt)}</span>
            {isOwnMessage && <DeliveryStatusIcon status={message.status} />}
          </div>
        </div>

        <MessageReactions
          reactions={message.reactions}
          align={align}
          onToggle={(emoji) =>
            dispatch(reactionToggled({ conversationId: message.conversationId, messageId: message.id, emoji }))
          }
        />

        {/* While "sending", the message id is still a temporary one that gets replaced
            once the server confirms it — actions that key off that id (edit, reply,
            delete) are hidden until it settles, so they can't be left pointing at a
            stale id. */}
        {!isEditing && message.status !== 'sending' && (
          <MessageActionsMenu
            isOwnMessage={isOwnMessage}
            align={align}
            onReply={() => dispatch(replyTargetChanged({ conversationId: message.conversationId, messageId: message.id }))}
            onCopy={() => void navigator.clipboard.writeText(message.text)}
            onEdit={() => dispatch(editingMessageChanged(message.id))}
            onDelete={() => void handleDelete()}
          />
        )}
      </div>
    </div>
  )
}
