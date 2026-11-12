import { useEffect } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useRealtimeSync } from '@/hooks/useRealtimeSync'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { loadConversations } from '@/store/conversationsSlice'
import { loadMessages } from '@/store/messagesSlice'
import { loadUsers } from '@/store/usersSlice'
import { Sidebar } from '@/features/conversations/components/Sidebar'
import { ChatWindow } from '@/features/messages/components/ChatWindow'
import { GroupInfoPanel } from '@/features/groups/components/GroupInfoPanel'

const DESKTOP_QUERY = '(min-width: 768px)'

/** Loads the initial app data: users, conversations, then every conversation's message history. */
function useBootstrapData() {
  const dispatch = useAppDispatch()
  const conversations = useAppSelector((state) => state.conversations.conversations)

  useEffect(() => {
    void dispatch(loadUsers())
    void dispatch(loadConversations())
  }, [dispatch])

  useEffect(() => {
    conversations.forEach((conversation) => void dispatch(loadMessages(conversation.id)))
  }, [conversations, dispatch])
}

/** Keeps the `dark` class on <html> in sync with the persisted theme preference. */
function useThemeSync() {
  const theme = useAppSelector((state) => state.theme.theme)
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])
}

export default function App() {
  useBootstrapData()
  useThemeSync()
  useRealtimeSync()

  const isDesktop = useMediaQuery(DESKTOP_QUERY)
  const mobilePanel = useAppSelector((state) => state.ui.mobilePanel)
  const activeConversationId = useAppSelector((state) => state.ui.activeConversationId)

  const showSidebar = isDesktop || mobilePanel === 'list'
  const showChat = isDesktop || mobilePanel === 'chat'
  const showInfo = mobilePanel === 'info' && Boolean(activeConversationId)

  return (
    <div className="h-screen w-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto flex h-full max-w-7xl">
        {showSidebar && (
          <div className="h-full w-full shrink-0 md:w-[340px]">
            <Sidebar />
          </div>
        )}

        {showChat && (
          <div className="h-full min-w-0 flex-1">
            <ChatWindow isMobile={!isDesktop} />
          </div>
        )}

        {showInfo && (
          <div className="h-full w-full shrink-0 border-l border-slate-200 md:w-[320px] dark:border-slate-800">
            <GroupInfoPanel />
          </div>
        )}
      </div>
    </div>
  )
}
