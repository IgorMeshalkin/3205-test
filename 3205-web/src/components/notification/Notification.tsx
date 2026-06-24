import { memo, useCallback, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../store'
import { markAsShowed } from '../../store/notification.slice'
import type { ENotificationType } from '../../store/notification.slice'
import styles from './Notification.module.scss'

type Phase = 'entering' | 'visible' | 'exiting'

type ActiveNotification = {
  id: number
  title: string
  message: string
  type: ENotificationType
  phase: Phase
}

const VISIBLE_DURATION = 3000
const ENTER_DELAY = 30
const EXIT_DURATION = 320

export const Notification = memo(() => {
  const dispatch = useAppDispatch()
  const items = useAppSelector(state => state.notification.items)
  const [active, setActive] = useState<ActiveNotification[]>([])

  useEffect(() => {
    const unshowed = items.filter(item => !item.isShowed)
    if (unshowed.length === 0) return

    unshowed.forEach(item => {
      const id = item.addedTimeStamp
      dispatch(markAsShowed(id))

      setActive(prev => {
        if (prev.some(n => n.id === id)) return prev
        return [{ id, ...item.notification, phase: 'entering' }, ...prev]
      })

      // Timers intentionally not cleaned up on re-run:
      // dispatch(markAsShowed) triggers an immediate re-render which would
      // fire the cleanup and kill these timers before they can execute.
      setTimeout(() => {
        setActive(prev =>
          prev.map(n => (n.id === id ? { ...n, phase: 'visible' } : n)),
        )
      }, ENTER_DELAY)

      setTimeout(() => {
        setActive(prev =>
          prev.map(n => (n.id === id ? { ...n, phase: 'exiting' } : n)),
        )
      }, ENTER_DELAY + VISIBLE_DURATION)

      setTimeout(() => {
        setActive(prev => prev.filter(n => n.id !== id))
      }, ENTER_DELAY + VISIBLE_DURATION + EXIT_DURATION)
    })
  }, [items, dispatch])

  const dismiss = useCallback((id: number) => {
    setActive(prev =>
      prev.map(n => (n.id === id ? { ...n, phase: 'exiting' } : n)),
    )
    setTimeout(() => {
      setActive(prev => prev.filter(n => n.id !== id))
    }, EXIT_DURATION)
  }, [])

  if (active.length === 0) return null

  return (
    <div className={styles.container} aria-live="polite" aria-label="Уведомления">
      {active.map(n => (
        <div
          key={n.id}
          className={`${styles.wrapper} ${styles[n.phase]}`}
        >
          <div
            className={`${styles.item} ${styles[n.phase]} ${styles[n.type]}`}
            onClick={() => dismiss(n.id)}
            role="alert"
          >
            <p className={styles.title}>{n.title}</p>
            <p className={styles.message}>{n.message}</p>
          </div>
        </div>
      ))}
    </div>
  )
})

Notification.displayName = 'Notification'
