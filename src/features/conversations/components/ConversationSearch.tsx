import { Search } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { searchQueryChanged } from '@/store/conversationsSlice'

export function ConversationSearch() {
  const dispatch = useAppDispatch()
  const searchQuery = useAppSelector((state) => state.conversations.searchQuery)

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={searchQuery}
        onChange={(event) => dispatch(searchQueryChanged(event.target.value))}
        placeholder="Search conversations"
        aria-label="Search conversations"
        className="w-full rounded-lg bg-slate-100 py-2 pr-3 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none dark:bg-slate-800 dark:text-slate-100"
      />
    </div>
  )
}
