import { ArrowLeft, Info } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { IconButton } from '@/components/ui/IconButton'
import { CURRENT_USER_ID } from '@/lib/constants'
import { formatLastSeen } from '@/lib/formatDate'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { backToListRequested, groupInfoShown } from '@/store/uiSlice'
import type { Conversation } from '@/types'
import { getConversationDisplay } from '@/features/conversations/conversationDisplay'

interface ChatHeaderProps {
  conversation: Conversation
  showBackButton: boolean
}

export function ChatHeader({ conversation, showBackButton }: ChatHeaderProps) {
  const dispatch = useAppDispatch()
  const users = useAppSelector((state) => state.users.users)
  const display = getConversationDisplay(conversation, users, CURRENT_USER_ID)

  const subtitle =
    conversation.type === 'group'
      ? `${conversation.participantIds.length} members`
      : display.isOnline
        ? 'Online'
        : display.lastSeenAt
          ? formatLastSeen(display.lastSeenAt)
          : ''

  return (
    <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
      {showBackButton && (
        <IconButton label="Back to conversations" onClick={() => dispatch(backToListRequested())} className="-ml-2">
          <ArrowLeft className="h-5 w-5" />
        </IconButton>
      )}

      <Avatar src={display.avatarUrl} name={display.name} isOnline={conversation.type === 'direct' ? display.isOnline : undefined} />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{display.name}</p>
        <p className="truncate text-xs text-slate-400">{subtitle}</p>
      </div>

      {conversation.type === 'group' && (
        <IconButton label="Group info" onClick={() => dispatch(groupInfoShown())}>
          <Info className="h-5 w-5" />
        </IconButton>
      )}
    </div>
  )
}
