import { X } from 'lucide-react'
import { IconButton } from '@/components/ui/IconButton'
import { CURRENT_USER_ID } from '@/lib/constants'
import { useAppSelector } from '@/store/hooks'
import type { Message } from '@/types'

interface ReplyComposeBannerProps {
  repliedMessage: Message
  onCancel: () => void
}

/** Shown above the compose box while the user is replying to a specific message. */
export function ReplyComposeBanner({ repliedMessage, onCancel }: ReplyComposeBannerProps) {
  const otherSenderName = useAppSelector((state) => state.users.users.find((u) => u.id === repliedMessage.senderId)?.name)
  const senderName = repliedMessage.senderId === CURRENT_USER_ID ? 'You' : (otherSenderName ?? 'Unknown')

  return (
    <div className="flex items-center justify-between gap-2 border-l-2 border-emerald-500 bg-slate-50 px-3 py-1.5 text-xs dark:bg-slate-800/60">
      <div className="min-w-0">
        <p className="font-medium text-emerald-600 dark:text-emerald-400">Replying to {senderName}</p>
        <p className="truncate text-slate-500 dark:text-slate-400">{repliedMessage.text}</p>
      </div>
      <IconButton label="Cancel reply" size="sm" onClick={onCancel}>
        <X className="h-4 w-4" />
      </IconButton>
    </div>
  )
}
