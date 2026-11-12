import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

/** Which panel is visible on narrow (mobile) viewports; desktop shows list + chat together. */
export type MobilePanel = 'list' | 'chat' | 'info'

interface UiState {
  activeConversationId: string | null
  mobilePanel: MobilePanel
  replyTargetByConversation: Record<string, string | null>
  editingMessageId: string | null
}

const initialState: UiState = {
  activeConversationId: null,
  mobilePanel: 'list',
  replyTargetByConversation: {},
  editingMessageId: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    conversationSelected(state, action: PayloadAction<string>) {
      state.activeConversationId = action.payload
      state.mobilePanel = 'chat'
      state.editingMessageId = null
    },
    backToListRequested(state) {
      state.mobilePanel = 'list'
    },
    groupInfoShown(state) {
      state.mobilePanel = 'info'
    },
    groupInfoHidden(state) {
      state.mobilePanel = 'chat'
    },
    replyTargetChanged(state, action: PayloadAction<{ conversationId: string; messageId: string | null }>) {
      state.replyTargetByConversation[action.payload.conversationId] = action.payload.messageId
    },
    editingMessageChanged(state, action: PayloadAction<string | null>) {
      state.editingMessageId = action.payload
    },
  },
})

export const {
  conversationSelected,
  backToListRequested,
  groupInfoShown,
  groupInfoHidden,
  replyTargetChanged,
  editingMessageChanged,
} = uiSlice.actions
export default uiSlice.reducer
