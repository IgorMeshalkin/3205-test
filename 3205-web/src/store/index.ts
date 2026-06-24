import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { activeJobReducer, STORAGE_KEY } from './activeJob.slice'
import { notificationReducer } from './notification.slice'

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    activeJob: activeJobReducer,
  },
})

store.subscribe(() => {
  const { activeJobId } = store.getState().activeJob

  if (activeJobId === null) {
    localStorage.removeItem(STORAGE_KEY)
  } else {
    localStorage.setItem(STORAGE_KEY, activeJobId)
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
