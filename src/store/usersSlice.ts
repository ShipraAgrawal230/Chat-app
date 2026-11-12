import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchUsers } from '@/services/mockApi'
import type { User } from '@/types'
import type { RootState } from '@/store'

interface UsersState {
  users: User[]
  status: 'idle' | 'loading' | 'ready' | 'error'
}

const initialState: UsersState = {
  users: [],
  status: 'idle',
}

export const loadUsers = createAsyncThunk('users/load', fetchUsers)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    presenceChanged(state, action: PayloadAction<{ userId: string; isOnline: boolean }>) {
      const user = state.users.find((u) => u.id === action.payload.userId)
      if (!user) return
      user.isOnline = action.payload.isOnline
      if (!action.payload.isOnline) user.lastSeenAt = new Date().toISOString()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.users = action.payload
        state.status = 'ready'
      })
      .addCase(loadUsers.rejected, (state) => {
        state.status = 'error'
      })
  },
})

export const { presenceChanged } = usersSlice.actions
export default usersSlice.reducer

export function selectUserById(state: RootState, userId: string): User | undefined {
  return state.users.users.find((user) => user.id === userId)
}
