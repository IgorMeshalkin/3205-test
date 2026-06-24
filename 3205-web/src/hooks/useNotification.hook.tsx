import { useAppDispatch } from '../store'
import { addNotification, type TNotification } from '../store/notification.slice'

export const useNotification = () => {
  const dispatch = useAppDispatch()

  const showNotification = (notification: TNotification) => {
    dispatch(addNotification(notification))
  }

  return { showNotification }
}
