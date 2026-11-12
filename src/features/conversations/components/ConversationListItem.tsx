import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'
import { CURRENT_USER_ID } from '@/lib/constants'
import { formatConversationTimestamp } from '@/lib/formatDate'
import type { VisibleConversation } from '@/features/conversations/useVisibleConversations'

interface ConversationListItemProps {
  item: VisibleConversation
  isActive: boolean
  onSelect: () => void
}

export function ConversationListItem({ item, isActive, onSelect }: ConversationListItemProps) {
  const { conversation, name, avatarUrl, isOnline, lastMessage } = item

  const preview = lastMessage
    ? `${lastMessage.senderId === CURRENT_USER_ID ? 'You: ' : ''}${lastMessage.text}`
    : 'No messages yet'

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={isActive}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
        isActive ? 'bg-emerald-50 dark:bg-emerald-950/40' : 'hover:bg-slate-100 dark:hover:bg-slate-800/60',
      )}
    >
      <Avatar src={avatarUrl} name={name} isOnline={conversation.type === 'direct' ? isOnline : undefined} />

      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{name}</span>
          {lastMessage && (
            <span className="shrink-0 text-xs text-slate-400">{formatConversationTimestamp(lastMessage.createdAt)}</span>
          )}
        </span>
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-sm text-slate-500 dark:text-slate-400">{preview}</span>
          <Badge count={conversation.unreadCount} className="shrink-0" />
        </span>
      </span>
    </button>
  )
}
