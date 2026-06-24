import axios from 'axios'
import { useState } from 'react'
import { apiUrls } from '../shared/api/api'
import type { components } from '../shared/types/api'

type CreateJobDTO = components['schemas']['CreateJobDTO']
type GetJobDTO = components['schemas']['GetJobDTO']
type GetFullJobDTO = components['schemas']['GetFullJobDTO']

const createApiUrl = (path: string) =>
  `${process.env.NEXT_PUBLIC_API_URL ?? ''}${path}`

export const useJobApi = () => {
  const [isDeleteJobByIdLoading, setIsDeleteJobByIdLoading] = useState(false)
  const [deleteJobByIdError, setDeleteJobByIdError] = useState<unknown>(null)

  const [isGetJobsLoading, setIsGetJobsLoading] = useState(false)
  const [getJobsError, setGetJobsError] = useState<unknown>(null)

  const [isGetJobByIdLoading, setIsGetJobByIdLoading] = useState(false)
  const [getJobByIdError, setGetJobByIdError] = useState<unknown>(null)

  const [isCreateJobLoading, setIsCreateJobLoading] = useState(false)
  const [createJobError, setCreateJobError] = useState<unknown>(null)

  const deleteJobById = async (id: string) => {
    setIsDeleteJobByIdLoading(true)
    setDeleteJobByIdError(null)

    try {
      const response = await axios.delete<void>(
        createApiUrl(apiUrls.job.DELETE_JOB_BY_ID.url(id)),
      )

      return response.data
    } catch (error) {
      setDeleteJobByIdError(error)
      throw error
    } finally {
      setIsDeleteJobByIdLoading(false)
    }
  }

  const getJobs = async () => {
    setIsGetJobsLoading(true)
    setGetJobsError(null)

    try {
      const response = await axios.get<GetJobDTO[]>(
        createApiUrl(apiUrls.job.GET_API_JOBS.url()),
      )

      return response.data
    } catch (error) {
      setGetJobsError(error)
      throw error
    } finally {
      setIsGetJobsLoading(false)
    }
  }

  const getJobById = async (id: string) => {
    setIsGetJobByIdLoading(true)
    setGetJobByIdError(null)

    try {
      const response = await axios.get<GetFullJobDTO>(
        createApiUrl(apiUrls.job.GET_JOB_BY_ID.url(id)),
      )

      return response.data
    } catch (error) {
      setGetJobByIdError(error)
      throw error
    } finally {
      setIsGetJobByIdLoading(false)
    }
  }

  const createJob = async (body: CreateJobDTO) => {
    setIsCreateJobLoading(true)
    setCreateJobError(null)

    try {
      const response = await axios.post<GetJobDTO>(
        createApiUrl(apiUrls.job.POST_API_JOBS.url()),
        body,
      )

      return response.data
    } catch (error) {
      setCreateJobError(error)
      throw error
    } finally {
      setIsCreateJobLoading(false)
    }
  }

  return {
    deleteJobById,
    isDeleteJobByIdLoading,
    deleteJobByIdError,
    getJobs,
    isGetJobsLoading,
    getJobsError,
    getJobById,
    isGetJobByIdLoading,
    getJobByIdError,
    createJob,
    isCreateJobLoading,
    createJobError,
  }
}
