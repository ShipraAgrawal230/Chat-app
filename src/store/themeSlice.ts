import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'chat-app-theme'

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

interface ThemeState {
  theme: Theme
}

const initialState: ThemeState = {
  theme: getInitialTheme(),
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    themeToggled(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
    },
    themeSet(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
    },
  },
})

export const { themeToggled, themeSet } = themeSlice.actions
export default themeSlice.reducer

/** Persists the current theme to localStorage; wired up once in store/index.ts via `store.subscribe`. */
export function persistTheme(theme: Theme): void {
  localStorage.setItem(STORAGE_KEY, theme)
}
