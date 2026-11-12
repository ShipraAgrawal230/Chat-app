import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import {
  deleteMessage as apiDeleteMessage,
  editMessage as apiEditMessage,
  sendMessage as apiSendMessage,
  fetchMessages,
} from '@/services/mockApi'
import { CURRENT_USER_ID } from '@/lib/constants'
import type { Message, MessageStatus, TypingState } from '@/types'
import type { RootState } from '@/store'

interface MessagesState {
  messagesByConversation: Record<string, Message[]>
  loadingConversationIds: Record<string, boolean>
  typing: TypingState
}

const initialState: MessagesState = {
  messagesByConversation: {},
  loadingConversationIds: {},
  typing: {},
}

/** Loads a conversation's history once; skipped if already loaded or already in flight. */
export const loadMessages = createAsyncThunk<Message[], string, { state: RootState }>(
  'messages/loadForConversation',
  (conversationId) => fetchMessages(conversationId),
  {
    condition: (conversationId, { getState }) => {
      const state = getState().messages
      return !state.messagesByConversation[conversationId] && !state.loadingConversationIds[conversationId]
    },
  },
)

interface SendMessageArg {
  conversationId: string
  text: string
  replyToId?: string
}

/**
 * Sends a message optimistically: the `pending` reducer below inserts a
 * "sending" placeholder (keyed by the thunk's auto-generated `requestId`)
 * the instant this is dispatched, `fulfilled` swaps it for the server's
 * confirmed message, and `rejected` marks it failed. After confirmation it
 * schedules the delivered/read ticks, mimicking a recipient's client.
 */
export const sendMessage = createAsyncThunk<Message, SendMessageArg, { state: RootState }>(
  'messages/send',
  async ({ conversationId, text, replyToId }, { dispatch }) => {
    const confirmed = await apiSendMessage({ conversationId, senderId: CURRENT_USER_ID, text, replyToId })

    setTimeout(
      () => dispatch(messageStatusChanged({ conversationId, messageId: confirmed.id, status: 'delivered' })),
      500 + Math.random() * 500,
    )
    setTimeout(
      () => dispatch(messageStatusChanged({ conversationId, messageId: confirmed.id, status: 'read' })),
      1800 + Math.random() * 1800,
    )

    return confirmed
  },
)

export const editMessage = createAsyncThunk(
  'messages/edit',
  async ({ messageId, text }: { conversationId: string; messageId: string; text: string }) => apiEditMessage(messageId, text),
)

export const deleteMessage = createAsyncThunk(
  'messages/delete',
  async ({ messageId }: { conversationId: string; messageId: string }) => {
    await apiDeleteMessage(messageId)
  },
)

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    reactionToggled(state, action: PayloadAction<{ conversationId: string; messageId: string; emoji: string }>) {
      const { conversationId, messageId, emoji } = action.payload
      const message = state.messagesByConversation[conversationId]?.find((m) => m.id === messageId)
      if (!message) return

      const existing = message.reactions.find((r) => r.emoji === emoji)
      const alreadyReacted = existing?.userIds.includes(CURRENT_USER_ID) ?? false

      if (alreadyReacted) {
        message.reactions = message.reactions
          .map((r) => (r.emoji === emoji ? { ...r, userIds: r.userIds.filter((id) => id !== CURRENT_USER_ID) } : r))
          .filter((r) => r.userIds.length > 0)
      } else if (existing) {
        existing.userIds.push(CURRENT_USER_ID)
      } else {
        message.reactions.push({ emoji, userIds: [CURRENT_USER_ID] })
      }
    },

    messageReceived(state, action: PayloadAction<Message>) {
      const conversationId = action.payload.conversationId
      ;(state.messagesByConversation[conversationId] ??= []).push(action.payload)
    },

    messageStatusChanged(
      state,
      action: PayloadAction<{ conversationId: string; messageId: string; status: MessageStatus }>,
    ) {
      const { conversationId, messageId, status } = action.payload
      const message = state.messagesByConversation[conversationId]?.find((m) => m.id === messageId)
      if (message) message.status = status
    },

    typingChanged(state, action: PayloadAction<{ conversationId: string; userId: string; isTyping: boolean }>) {
      const { conversationId, userId, isTyping } = action.payload
      const current = state.typing[conversationId] ?? []
      state.typing[conversationId] = isTyping ? [...new Set([...current, userId])] : current.filter((id) => id !== userId)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMessages.pending, (state, action) => {
        state.loadingConversationIds[action.meta.arg] = true
      })
      .addCase(loadMessages.fulfilled, (state, action) => {
        state.messagesByConversation[action.meta.arg] = action.payload
        delete state.loadingConversationIds[action.meta.arg]
      })
      .addCase(loadMessages.rejected, (state, action) => {
        delete state.loadingConversationIds[action.meta.arg]
      })

      .addCase(sendMessage.pending, (state, action) => {
        const { conversationId, text, replyToId } = action.meta.arg
        const optimisticMessage: Message = {
          id: action.meta.requestId,
          conversationId,
          senderId: CURRENT_USER_ID,
          text,
          replyToId,
          createdAt: new Date().toISOString(),
          status: 'sending',
          reactions: [],
        }
        ;(state.messagesByConversation[conversationId] ??= []).push(optimisticMessage)
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const messages = state.messagesByConversation[action.meta.arg.conversationId]
        const index = messages?.findIndex((m) => m.id === action.meta.requestId) ?? -1
        if (index !== -1) messages[index] = action.payload
      })
      .addCase(sendMessage.rejected, (state, action) => {
        const message = state.messagesByConversation[action.meta.arg.conversationId]?.find(
          (m) => m.id === action.meta.requestId,
        )
        if (message) message.status = 'failed'
      })

      .addCase(editMessage.fulfilled, (state, action) => {
        const { conversationId, messageId } = action.meta.arg
        const message = state.messagesByConversation[conversationId]?.find((m) => m.id === messageId)
        if (message) {
          message.text = action.payload.text
          message.editedAt = action.payload.editedAt
        }
      })

      .addCase(deleteMessage.fulfilled, (state, action) => {
        const { conversationId, messageId } = action.meta.arg
        state.messagesByConversation[conversationId] = (state.messagesByConversation[conversationId] ?? []).filter(
          (m) => m.id !== messageId,
        )
      })
  },
})

export const { reactionToggled, messageReceived, messageStatusChanged, typingChanged } = messagesSlice.actions
export default messagesSlice.reducer
