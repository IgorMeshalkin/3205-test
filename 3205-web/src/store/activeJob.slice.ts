import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export const STORAGE_KEY = 'activeJobId'

type ActiveJobState = {
  activeJobId: string | null
}

const initialState: ActiveJobState = {
  activeJobId: localStorage.getItem(STORAGE_KEY),
}

const activeJobSlice = createSlice({
  name: 'activeJob',
  initialState,
  reducers: {
    setActiveJob: (state, action: PayloadAction<string>) => {
      state.activeJobId = action.payload
    },
    clearActiveJob: (state) => {
      state.activeJobId = null
    },
  },
})

export const { setActiveJob, clearActiveJob } = activeJobSlice.actions
export const activeJobReducer = activeJobSlice.reducer
