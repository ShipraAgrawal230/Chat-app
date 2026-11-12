import { Avatar } from '@/components/ui/Avatar'
import { CURRENT_USER_ID } from '@/lib/constants'
import { useAppSelector } from '@/store/hooks'
import { selectUserById } from '@/store/usersSlice'
import { ThemeToggle } from '@/features/theme/ThemeToggle'
import { ConversationSearch } from '@/features/conversations/components/ConversationSearch'
import { ConversationFilterTabs } from '@/features/conversations/components/ConversationFilterTabs'
import { ConversationList } from '@/features/conversations/components/ConversationList'

export function Sidebar() {
  const currentUser = useAppSelector((state) => selectUserById(state, CURRENT_USER_ID))

  return (
    <div className="flex h-full flex-col border-r border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {currentUser && <Avatar src={currentUser.avatarUrl} name={currentUser.name} size="sm" />}
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Chats</h1>
        </div>
        <ThemeToggle />
      </div>

      <div className="space-y-3 px-4 py-3">
        <ConversationSearch />
        <ConversationFilterTabs />
      </div>

      <ConversationList />
    </div>
  )
}
