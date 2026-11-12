import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchConversations } from '@/services/mockApi'
import type { Conversation, ConversationFilter } from '@/types'

interface ConversationsState {
  conversations: Conversation[]
  status: 'idle' | 'loading' | 'ready' | 'error'
  searchQuery: string
  filter: ConversationFilter
}

const initialState: ConversationsState = {
  conversations: [],
  status: 'idle',
  searchQuery: '',
  filter: 'all',
}

export const loadConversations = createAsyncThunk('conversations/load', fetchConversations)

const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    searchQueryChanged(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
    },
    filterChanged(state, action: PayloadAction<ConversationFilter>) {
      state.filter = action.payload
    },
    markedAsRead(state, action: PayloadAction<string>) {
      const conversation = state.conversations.find((c) => c.id === action.payload)
      if (conversation) conversation.unreadCount = 0
    },
    unreadIncremented(state, action: PayloadAction<string>) {
      const conversation = state.conversations.find((c) => c.id === action.payload)
      if (conversation) conversation.unreadCount += 1
    },
    memberAdded(state, action: PayloadAction<{ conversationId: string; userId: string }>) {
      const conversation = state.conversations.find((c) => c.id === action.payload.conversationId)
      if (conversation && !conversation.participantIds.includes(action.payload.userId)) {
        conversation.participantIds.push(action.payload.userId)
      }
    },
    memberRemoved(state, action: PayloadAction<{ conversationId: string; userId: string }>) {
      const conversation = state.conversations.find((c) => c.id === action.payload.conversationId)
      if (conversation) {
        conversation.participantIds = conversation.participantIds.filter((id) => id !== action.payload.userId)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadConversations.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(loadConversations.fulfilled, (state, action) => {
        state.conversations = action.payload
        state.status = 'ready'
      })
      .addCase(loadConversations.rejected, (state) => {
        state.status = 'error'
      })
  },
})

export const { searchQueryChanged, filterChanged, markedAsRead, unreadIncremented, memberAdded, memberRemoved } =
  conversationsSlice.actions
export default conversationsSlice.reducer
