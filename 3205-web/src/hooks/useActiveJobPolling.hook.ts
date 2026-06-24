import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import { apiUrls } from '../shared/api/api'
import { useAppSelector } from '../store'
import type { components } from '../shared/types/api'

type GetJobDTO = components['schemas']['GetJobDTO']
type GetFullJobDTO = components['schemas']['GetFullJobDTO']

const createApiUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_API_URL ?? ''}${path}`

const toJobDTO = (fullJob: GetFullJobDTO): GetJobDTO => ({
  id: fullJob.id,
  createdAt: fullJob.createdAt,
  status: fullJob.status,
  successUrlCount: fullJob.tasks.filter(
    (t) => t.status === 'success',
  ).length as unknown as GetJobDTO['successUrlCount'],
  failedUrlCount: fullJob.tasks.filter(
    (t) => t.status === 'error',
  ).length as unknown as GetJobDTO['failedUrlCount'],
})

export const useActiveJobPolling = (intervalMs = 1000) => {
  const activeJobId = useAppSelector((state) => state.activeJob.activeJobId)

  const [job, setJob] = useState<GetJobDTO | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prevStatusRef = useRef<GetJobDTO['status'] | null>(null)

  const clearPolling = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const fetchJob = useCallback(
    async (id: string): Promise<GetJobDTO | null> => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await axios.get<GetFullJobDTO>(
          createApiUrl(apiUrls.job.GET_JOB_BY_ID.url(id)),
        )

        const jobDTO = toJobDTO(response.data)

        if (prevStatusRef.current === 'in_progress' && jobDTO.status !== 'in_progress') {
          clearPolling()
        }

        prevStatusRef.current = jobDTO.status
        setJob(jobDTO)
        return jobDTO
      } catch (err) {
        setError(err)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [clearPolling],
  )

  const startPolling = useCallback(
    (id: string) => {
      intervalRef.current = setInterval(() => void fetchJob(id), intervalMs)
    },
    [fetchJob, intervalMs],
  )

  const refresh = useCallback(() => {
    if (!activeJobId) return
    clearPolling()
    void (async () => {
      const fetched = await fetchJob(activeJobId)
      if (fetched?.status === 'in_progress') {
        startPolling(activeJobId)
      }
    })()
  }, [activeJobId, clearPolling, fetchJob, startPolling])

  useEffect(() => {
    if (!activeJobId) {
      clearPolling()
      return
    }

    prevStatusRef.current = null

    void (async () => {
      const fetched = await fetchJob(activeJobId)
      if (fetched?.status === 'in_progress') {
        startPolling(activeJobId)
      }
    })()

    return clearPolling
  }, [activeJobId, fetchJob, clearPolling, startPolling])

  return { job, isLoading, error, refresh }
}
