import { useRef, useState } from 'react'
import { SmilePlus } from 'lucide-react'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import { cn } from '@/lib/cn'
import { CURRENT_USER_ID, QUICK_REACTIONS } from '@/lib/constants'
import type { MessageReaction } from '@/types'

interface MessageReactionsProps {
  reactions: MessageReaction[]
  onToggle: (emoji: string) => void
  /** Mirrors the bubble alignment so the "add reaction" trigger sits on the correct side. */
  align: 'start' | 'end'
}

export function MessageReactions({ reactions, onToggle, align }: MessageReactionsProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  useOnClickOutside(containerRef, () => setPickerOpen(false))

  return (
    <div className={cn('relative mt-1 flex flex-wrap items-center gap-1', align === 'end' && 'justify-end')} ref={containerRef}>
      {reactions.map((reaction) => {
        const reactedByMe = reaction.userIds.includes(CURRENT_USER_ID)
        return (
          <button
            key={reaction.emoji}
            type="button"
            onClick={() => onToggle(reaction.emoji)}
            aria-pressed={reactedByMe}
            className={cn(
              'flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-xs transition-colors',
              reactedByMe
                ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800',
            )}
          >
            <span>{reaction.emoji}</span>
            <span className="text-slate-500 dark:text-slate-400">{reaction.userIds.length}</span>
          </button>
        )
      })}

      <button
        type="button"
        aria-label="Add reaction"
        onClick={() => setPickerOpen((open) => !open)}
        className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
      >
        <SmilePlus className="h-3.5 w-3.5" />
      </button>

      {pickerOpen && (
        <div
          className={cn(
            'absolute bottom-full z-10 mb-1 flex gap-1 rounded-full border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-800',
            align === 'end' ? 'right-0' : 'left-0',
          )}
        >
          {QUICK_REACTIONS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => {
                onToggle(emoji)
                setPickerOpen(false)
              }}
              className="rounded-full p-1 text-lg hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
