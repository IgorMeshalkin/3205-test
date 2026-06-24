import { useEffect, useRef, useState } from 'react'
import copyIcon from '../../assets/copy.svg'
import stopIcon from '../../assets/stop.svg'
import { CreateJobForm } from '../../components/create-job-form'
import { useJobApi } from '../../hooks/useJobApi.hook.tsx'
import {
  ENotificationType,
  useNotification,
} from '../../hooks/useNotification.hook.tsx'
import type { components } from '../../shared/types/api'
import styles from './JobsPage.module.scss'

type Job = components['schemas']['GetJobDTO']

const statusLabels: Record<Job['status'], string> = {
  pending: 'Ожидает',
  in_progress: 'В работе',
  completed: 'Завершено',
  cancelled: 'Отменено',
  failed: 'Ошибка',
}

const statusClassNames: Record<Job['status'], string> = {
  pending: styles.statusPending,
  in_progress: styles.statusInProgress,
  completed: styles.statusCompleted,
  cancelled: styles.statusDanger,
  failed: styles.statusDanger,
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))

const formatCount = (value: Job['successUrlCount']) => {
  if (value === null) {
    return '0'
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return String(Object.keys(value).length)
}

const formatJobId = (id: string) => {
  if (id.length <= 7) {
    return id
  }

  return `${id.slice(0, 3)}...${id.slice(-4)}`
}

const canStopJob = (status: Job['status']) =>
  status === 'pending' || status === 'in_progress'

const getArrayProperty = (value: unknown, key: string) => {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  const property = (value as Record<string, unknown>)[key]

  return Array.isArray(property) ? property : null
}

const normalizeJobsResponse = (response: unknown): Job[] => {
  if (Array.isArray(response)) {
    return response as Job[]
  }

  const knownList =
    getArrayProperty(response, 'data') ??
    getArrayProperty(response, 'jobs') ??
    getArrayProperty(response, 'items') ??
    getArrayProperty(response, 'results')

  return knownList === null ? [] : (knownList as Job[])
}

export function JobsPage() {
  const { createJob, deleteJobById, getJobs, isGetJobsLoading, getJobsError } =
    useJobApi()
  const { showNotification } = useNotification()
  const getJobsRef = useRef(getJobs)
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [isCreateJobFormOpen, setIsCreateJobFormOpen] = useState(false)
  const [stoppingJobId, setStoppingJobId] = useState<string | null>(null)

  useEffect(() => {
    getJobsRef.current = getJobs
  }, [getJobs])

  useEffect(() => {
    let isMounted = true

    const loadJobs = async () => {
      const jobs = await getJobsRef.current()

      if (isMounted) {
        setJobs(normalizeJobsResponse(jobs))
        setIsLoaded(true)
      }
    }

    void loadJobs().catch(() => {
      if (isMounted) {
        setIsLoaded(true)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const handleCopyJobId = async (id: string) => {
    await navigator.clipboard.writeText(id)
    showNotification({
      title: 'Id задания скопирован',
      message: id,
      type: ENotificationType.SUCCESS,
    })
  }

  const handleOpenCreateJobForm = () => {
    setIsCreateJobFormOpen(true)
  }

  const handleCloseCreateJobForm = () => {
    setIsCreateJobFormOpen(false)
  }

  const handleCreateJob = async (urls: string[]) => {
    setIsCreateJobFormOpen(false)

    try {
      await createJob({ urls })
      showNotification({
        title: 'Задание создано',
        message: `Адресов в задании: ${urls.length}`,
        type: ENotificationType.SUCCESS,
      })
    } catch {
      showNotification({
        title: 'Не удалось создать задание',
        message: 'Проверьте адреса и попробуйте еще раз',
        type: ENotificationType.ERROR,
      })
      return
    }

    try {
      const jobs = await getJobs()
      setJobs(normalizeJobsResponse(jobs))
    } catch {
      showNotification({
        title: 'Задание создано',
        message: 'Не удалось обновить список заданий',
        type: ENotificationType.WARNING,
      })
    }
  }

  const handleStopJob = async (id: string) => {
    setStoppingJobId(id)

    try {
      await deleteJobById(id)
      setJobs((jobs) =>
        jobs.map((job) =>
          job.id === id ? { ...job, status: 'cancelled' } : job,
        ),
      )
      showNotification({
        title: 'Задание отменено',
        message: `Задание ${formatJobId(id)} успешно отменено`,
        type: ENotificationType.SUCCESS,
      })
    } catch {
      try {
        const jobs = await getJobs()
        setJobs(normalizeJobsResponse(jobs))
      } catch {
        showNotification({
          title: 'Не удалось обновить список заданий',
          message: 'Попробуйте обновить страницу',
          type: ENotificationType.WARNING,
        })
      }

      showNotification({
        title: 'Не удалось отменить задание',
        message: `Попробуйте отменить задание ${formatJobId(id)} еще раз`,
        type: ENotificationType.ERROR,
      })
    } finally {
      setStoppingJobId(null)
    }
  }

  if (!isLoaded || isGetJobsLoading) {
    return (
      <section className={styles.centerState}>
        <p className={styles.stateText}>Загружаем задания</p>
      </section>
    )
  }

  if (getJobsError) {
    return (
      <section className={styles.centerState}>
        <p className={styles.stateText}>Не удалось загрузить задания</p>
      </section>
    )
  }

  if (isLoaded && jobs.length === 0) {
    return (
      <section className={styles.centerState}>
        <div className={styles.emptyState}>
          <p className={styles.stateText}>У вас пока нет заданий</p>
          <button
            className={styles.primaryButton}
            onClick={handleOpenCreateJobForm}
            type="button"
          >
            Создать задание
          </button>
        </div>
        <CreateJobForm
          isOpen={isCreateJobFormOpen}
          onCreate={(urls) => {
            void handleCreateJob(urls)
          }}
          onClose={handleCloseCreateJobForm}
        />
      </section>
    )
  }

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <h1>Ваши задания</h1>
        <button
          className={styles.primaryButton}
          onClick={handleOpenCreateJobForm}
          type="button"
        >
          Создать задание
        </button>
      </header>

      <div className={styles.list}>
        {jobs.map((job) => (
          <article className={styles.item} key={job.id}>
            <div className={styles.itemMain}>
              <div className={styles.jobTitle}>
                <h2 title={job.id}>Задание {formatJobId(job.id)}</h2>
                <button
                  className={styles.copyButton}
                  type="button"
                  aria-label="Копировать id задания"
                  title="Копировать id задания"
                  onClick={() => {
                    void handleCopyJobId(job.id)
                  }}
                >
                  <img src={copyIcon} alt="" />
                </button>
              </div>
              <span className={styles.date}>{formatDate(job.createdAt)}</span>
            </div>

            <div className={styles.meta}>
              {canStopJob(job.status) && (
                <button
                  className={styles.stopButton}
                  type="button"
                  aria-label="Остановить задание"
                  title="Остановить задание"
                  disabled={stoppingJobId === job.id}
                  onClick={() => {
                    void handleStopJob(job.id)
                  }}
                >
                  <img src={stopIcon} alt="" />
                </button>
              )}
              <span className={`${styles.status} ${statusClassNames[job.status]}`}>
                {statusLabels[job.status]}
              </span>
              <span>Успешно: {formatCount(job.successUrlCount)}</span>
              <span>Ошибки: {formatCount(job.failedUrlCount)}</span>
            </div>
          </article>
        ))}
      </div>
      <CreateJobForm
        isOpen={isCreateJobFormOpen}
        onCreate={(urls) => {
          void handleCreateJob(urls)
        }}
        onClose={handleCloseCreateJobForm}
      />
    </section>
  )
}
