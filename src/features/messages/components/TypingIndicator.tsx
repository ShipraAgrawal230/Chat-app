import { useAppSelector } from '@/store/hooks'

interface TypingIndicatorProps {
  conversationId: string
}

// Stable fallback reference: a selector must return the same identity across
// calls when nothing changed, or useSyncExternalStore re-renders forever.
const NO_TYPING_USERS: string[] = []

export function TypingIndicator({ conversationId }: TypingIndicatorProps) {
  const typingUserIds = useAppSelector((state) => state.messages.typing[conversationId] ?? NO_TYPING_USERS)
  const users = useAppSelector((state) => state.users.users)

  if (typingUserIds.length === 0) return null

  const names = typingUserIds
    .map((id) => users.find((user) => user.id === id)?.name)
    .filter((name): name is string => Boolean(name))

  const label = names.length === 1 ? `${names[0]} is typing` : `${names.join(', ')} are typing`

  return (
    <div className="flex items-center gap-2 px-4 py-1 text-xs text-slate-400">
      <span className="flex gap-0.5">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
      </span>
      {label}
    </div>
  )
}
