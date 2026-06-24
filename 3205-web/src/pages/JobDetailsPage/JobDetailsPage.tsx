import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import copyIcon from '../../assets/copy.svg'
import { useJobApi } from '../../hooks/useJobApi.hook.tsx'
import { useNotification } from '../../hooks/useNotification.hook.tsx'
import type { components } from '../../shared/types/api'
import { setActiveJob } from '../../store/activeJob.slice'
import { useAppDispatch, useAppSelector } from '../../store'
import { ENotificationType } from '../../store/notification.slice'
import styles from './JobDetailsPage.module.scss'

type Job = components['schemas']['GetFullJobDTO']
type Task = components['schemas']['GetTaskDTO']

const jobStatusLabels: Record<Job['status'], string> = {
  pending: 'Ожидает',
  in_progress: 'В работе',
  completed: 'Завершено',
  cancelled: 'Отменено',
  failed: 'Ошибка',
}

const taskStatusLabels: Record<Task['status'], string> = {
  pending: 'Ожидает',
  in_progress: 'В работе',
  success: 'Успешно',
  error: 'Ошибка',
  cancelled: 'Отменено',
}

const jobStatusClassNames: Record<Job['status'], string> = {
  pending: styles.statusPending,
  in_progress: styles.statusInProgress,
  completed: styles.statusCompleted,
  cancelled: styles.statusDanger,
  failed: styles.statusDanger,
}

const taskStatusClassNames: Record<Task['status'], string> = {
  pending: styles.statusPending,
  in_progress: styles.statusInProgress,
  success: styles.statusCompleted,
  error: styles.statusDanger,
  cancelled: styles.statusDanger,
}

const formatDate = (value?: string) => {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

const formatDateTimeParts = (value?: string) => {
  if (!value) {
    return null
  }

  const date = new Date(value)

  return {
    date: new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date),
    time: new Intl.DateTimeFormat('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date),
  }
}

const renderDateTime = (value?: string) => {
  const dateTime = formatDateTimeParts(value)

  if (!dateTime) {
    return '-'
  }

  return (
    <>
      <span>{dateTime.date}</span>
      <span>{dateTime.time}</span>
    </>
  )
}

const formatCount = (value: Job['successUrlCount']) => {
  if (value === null) {
    return '0'
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return String(Object.keys(value).length)
}

const formatDuration = (value?: number) => {
  if (typeof value !== 'number') {
    return '-'
  }

  if (value < 1000) {
    return `${value} мс`
  }

  return `${(value / 1000).toFixed(1)} с`
}

export function JobDetailsPage() {
  const { id } = useParams()
  const { getJobById, getJobByIdError, isGetJobByIdLoading } = useJobApi()
  const { showNotification } = useNotification()
  const dispatch = useAppDispatch()
  const activeJobId = useAppSelector((state) => state.activeJob.activeJobId)
  const getJobByIdRef = useRef(getJobById)
  const [job, setJob] = useState<Job | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    getJobByIdRef.current = getJobById
  }, [getJobById])

  useEffect(() => {
    if (!id) {
      return
    }

    let isMounted = true

    const loadJob = async () => {
      const job = await getJobByIdRef.current(id)

      if (isMounted) {
        setJob(job)
        setIsLoaded(true)
      }
    }

    void loadJob().catch(() => {
      if (isMounted) {
        setIsLoaded(true)
      }
    })

    return () => {
      isMounted = false
    }
  }, [id])

  const handleCopyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url)
    showNotification({
      title: 'URL скопирован',
      message: url,
      type: ENotificationType.SUCCESS,
    })
  }

  if (!id) {
    return <Navigate to="/404" replace />
  }

  if (!isLoaded || isGetJobByIdLoading) {
    return (
      <section className={styles.centerState}>
        <p className={styles.stateText}>Загружаем задание</p>
      </section>
    )
  }

  if (getJobByIdError || !job) {
    return (
      <section className={styles.centerState}>
        <div className={styles.emptyState}>
          <p className={styles.stateText}>Не удалось загрузить задание</p>
          <Link className={styles.secondaryButton} to="/">
            Вернуться к списку
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <Link className={styles.backLink} to="/">
            Назад к заданиям
          </Link>
          <h1 title={job.id}>Задание {job.id}</h1>
        </div>
        <div className={styles.headerActions}>
          {activeJobId === job.id ? (
            <span
              className={`${styles.activeBadge} ${job.status !== 'in_progress' ? styles.activeBadgeDisabled : ''}`}
            >
              {job.status !== 'in_progress' ? (
                <span className={styles.activeBadgeMarquee}>
                  Активное ({jobStatusLabels[job.status]})
                </span>
              ) : (
                'Активное'
              )}
            </span>
          ) : (
            <button
              className={styles.activateButton}
              type="button"
              disabled={job.status !== 'in_progress'}
              onClick={() => dispatch(setActiveJob(job.id))}
            >
              Сделать активным
            </button>
          )}
          <span className={`${styles.status} ${jobStatusClassNames[job.status]}`}>
            {jobStatusLabels[job.status]}
          </span>
        </div>
      </header>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span>Создано</span>
          <strong>{formatDate(job.createdAt)}</strong>
        </div>
        <div className={styles.summaryItem}>
          <span>Успешно</span>
          <strong>{formatCount(job.successUrlCount)}</strong>
        </div>
        <div className={styles.summaryItem}>
          <span>Ошибки</span>
          <strong>{formatCount(job.failedUrlCount)}</strong>
        </div>
        <div className={styles.summaryItem}>
          <span>Всего URL</span>
          <strong>{job.tasks.length}</strong>
        </div>
      </div>

      <div className={styles.tasks}>
        <div className={styles.tasksHeader}>
          <span>URL</span>
          <span>Статус</span>
          <span>HTTP СТАТУС</span>
          <span>Старт</span>
          <span>Финиш</span>
          <span>Время</span>
        </div>
        {job.tasks.map((task, index) => (
          <article className={styles.taskItem} key={`${task.url}-${index}`}>
            <div className={styles.urlBlock}>
              <div className={styles.urlTitle}>
                <h2 title={task.url}>{task.url}</h2>
                <button
                  className={styles.copyButton}
                  type="button"
                  aria-label="Копировать URL"
                  title="Копировать URL"
                  onClick={() => {
                    void handleCopyUrl(task.url)
                  }}
                >
                  <img src={copyIcon} alt="" />
                </button>
              </div>
              {task.errorMessage && (
                <p className={styles.errorMessage}>{task.errorMessage}</p>
              )}
            </div>
            <span className={`${styles.status} ${taskStatusClassNames[task.status]}`}>
              {taskStatusLabels[task.status]}
            </span>
            <span className={styles.metaValue}>{task.httpStatus ?? '-'}</span>
            <span className={`${styles.metaValue} ${styles.dateTimeValue}`}>
              {renderDateTime(task.startTime)}
            </span>
            <span className={`${styles.metaValue} ${styles.dateTimeValue}`}>
              {renderDateTime(task.endTime)}
            </span>
            <span className={styles.metaValue}>{formatDuration(task.executionTimeMs)}</span>
          </article>
        ))}
      </div>
    </section>
  )
}
