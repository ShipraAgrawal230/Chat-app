import { useEffect } from 'react'
import { realtimeEmitter } from '@/services/realtimeEmitter'
import { startRealtimeSimulation } from '@/services/realtimeSimulator'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { unreadIncremented } from '@/store/conversationsSlice'
import { messageReceived, messageStatusChanged, typingChanged } from '@/store/messagesSlice'
import { presenceChanged } from '@/store/usersSlice'
import { store } from '@/store'
import { CURRENT_USER_ID } from '@/lib/constants'

/**
 * Bridges the mock realtime layer (`realtimeEmitter` + `realtimeSimulator`)
 * into the Redux store. Mounted once near the app root; starts the
 * simulated "socket connection" and tears it down on unmount.
 */
export function useRealtimeSync(): void {
  const dispatch = useAppDispatch()
  const conversations = useAppSelector((state) => state.conversations.conversations)
  const users = useAppSelector((state) => state.users.users)

  useEffect(() => {
    if (conversations.length === 0 || users.length === 0) return

    const stopSimulation = startRealtimeSimulation({ conversations, users, currentUserId: CURRENT_USER_ID })

    const unsubscribe = realtimeEmitter.subscribe((event) => {
      switch (event.type) {
        case 'message:incoming': {
          dispatch(messageReceived(event.message))
          const isActive = store.getState().ui.activeConversationId === event.message.conversationId
          if (!isActive) dispatch(unreadIncremented(event.message.conversationId))
          break
        }
        case 'message:status':
          dispatch(messageStatusChanged(event))
          break
        case 'typing:start':
          dispatch(typingChanged({ conversationId: event.conversationId, userId: event.userId, isTyping: true }))
          break
        case 'typing:stop':
          dispatch(typingChanged({ conversationId: event.conversationId, userId: event.userId, isTyping: false }))
          break
        case 'presence:change':
          dispatch(presenceChanged(event))
          break
      }
    })

    return () => {
      stopSimulation()
      unsubscribe()
    }
    // Only re-run if the reference lists genuinely change (post initial load), not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations.length, users.length, dispatch])
}
