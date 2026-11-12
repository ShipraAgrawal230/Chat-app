import { CURRENT_USER_ID } from '@/lib/constants'
import { useAppSelector } from '@/store/hooks'
import type { Message } from '@/types'

interface MessageReplyQuoteProps {
  repliedMessage: Message | undefined
}

/** Compact quoted reference rendered inside a bubble for messages sent as a reply. */
export function MessageReplyQuote({ repliedMessage }: MessageReplyQuoteProps) {
  const users = useAppSelector((state) => state.users.users)

  if (!repliedMessage) {
    return <div className="mb-1 rounded border-l-2 border-slate-300 pl-2 text-xs text-slate-400 italic">Original message unavailable</div>
  }

  const senderName =
    repliedMessage.senderId === CURRENT_USER_ID
      ? 'You'
      : (users.find((user) => user.id === repliedMessage.senderId)?.name ?? 'Unknown')

  return (
    <div className="mb-1 rounded border-l-2 border-emerald-400 bg-black/5 px-2 py-1 text-xs dark:bg-white/10">
      <p className="font-medium text-emerald-700 dark:text-emerald-400">{senderName}</p>
      <p className="truncate text-slate-500 dark:text-slate-400">{repliedMessage.text}</p>
    </div>
  )
}
