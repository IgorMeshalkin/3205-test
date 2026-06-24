import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export const ENotificationType = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const

export type ENotificationType =
  (typeof ENotificationType)[keyof typeof ENotificationType]

export type TNotification = {
  title: string
  message: string
  type: ENotificationType
}

export type TNotificationItem = {
  notification: TNotification
  isShowed: boolean
  addedTimeStamp: number
}

type NotificationState = {
  items: TNotificationItem[]
}

const initialState: NotificationState = {
  items: [],
}

const notificationLifetime = 5000

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<TNotification>) => {
      const now = Date.now()

      state.items = state.items.filter(
        ({ isShowed, addedTimeStamp }) =>
          !isShowed || now - addedTimeStamp <= notificationLifetime,
      )

      state.items.push({
        notification: action.payload,
        isShowed: false,
        addedTimeStamp: now,
      })
    },
    markAsShowed: (state, action: PayloadAction<number>) => {
      const item = state.items.find(i => i.addedTimeStamp === action.payload)
      if (item) item.isShowed = true
    },
  },
})

export const { addNotification, markAsShowed } = notificationSlice.actions
export const notificationReducer = notificationSlice.reducer
