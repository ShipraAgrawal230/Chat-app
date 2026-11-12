import { UserMinus } from 'lucide-react'
import { Avatar } from '@/components/ui/Avatar'
import { IconButton } from '@/components/ui/IconButton'
import { formatLastSeen } from '@/lib/formatDate'
import type { User } from '@/types'

interface MemberRowProps {
  member: User
  isCurrentUser: boolean
  onRemove?: () => void
}

export function MemberRow({ member, isCurrentUser, onRemove }: MemberRowProps) {
  return (
    <li className="flex items-center gap-3 px-1 py-2">
      <Avatar src={member.avatarUrl} name={member.name} isOnline={member.isOnline} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
          {member.name} {isCurrentUser && <span className="text-slate-400">(you)</span>}
        </p>
        <p className="truncate text-xs text-slate-400">{member.isOnline ? 'Online' : formatLastSeen(member.lastSeenAt)}</p>
      </div>
      {onRemove && !isCurrentUser && (
        <IconButton label={`Remove ${member.name}`} size="sm" onClick={onRemove}>
          <UserMinus className="h-4 w-4" />
        </IconButton>
      )}
    </li>
  )
}
