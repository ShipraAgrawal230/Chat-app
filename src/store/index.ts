import { configureStore } from '@reduxjs/toolkit'
import conversationsReducer from '@/store/conversationsSlice'
import messagesReducer from '@/store/messagesSlice'
import themeReducer, { persistTheme } from '@/store/themeSlice'
import uiReducer from '@/store/uiSlice'
import usersReducer from '@/store/usersSlice'

export const store = configureStore({
  reducer: {
    users: usersReducer,
    conversations: conversationsReducer,
    messages: messagesReducer,
    ui: uiReducer,
    theme: themeReducer,
  },
})

// Persist the theme preference whenever it changes, without pulling a
// persistence library into the store for a single string value.
let lastPersistedTheme = store.getState().theme.theme
store.subscribe(() => {
  const theme = store.getState().theme.theme
  if (theme !== lastPersistedTheme) {
    lastPersistedTheme = theme
    persistTheme(theme)
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
