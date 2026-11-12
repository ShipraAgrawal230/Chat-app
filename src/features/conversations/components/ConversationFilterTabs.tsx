import { cn } from '@/lib/cn'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { filterChanged } from '@/store/conversationsSlice'
import type { ConversationFilter } from '@/types'

const TABS: { value: ConversationFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'groups', label: 'Groups' },
]

export function ConversationFilterTabs() {
  const dispatch = useAppDispatch()
  const filter = useAppSelector((state) => state.conversations.filter)

  return (
    <div role="tablist" aria-label="Filter conversations" className="flex gap-1">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={filter === tab.value}
          onClick={() => dispatch(filterChanged(tab.value))}
          className={cn(
            'rounded-full px-3 py-1 text-sm font-medium transition-colors',
            filter === tab.value
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
