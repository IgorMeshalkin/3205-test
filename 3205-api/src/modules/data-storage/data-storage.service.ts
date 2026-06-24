import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {CreateJobDTO, GetFullJobDTO} from "../../dto/job.dto";
import {EJobStatus, JobEntity} from "../../entity/job.entity";
import {ETaskStatus, TaskEntity} from "../../entity/task.entity";
import {NotFoundError} from "rxjs";

@Injectable()
export class DataStorageService {
    private jobs = new Map<string, JobEntity>();
    private tasks = new Map<string, TaskEntity>();
    
    async saveJob(job: CreateJobDTO): Promise<JobEntity> {
        // не сохраняет Job без заданий (urls)
        if (job.urls.length === 0) {
            throw new Error('Job must contain at least one url')
        }

        // генерирует уникальный id для Job
        const jobId = randomUUID();

        // формирует объект JobEntity
        const newJob: JobEntity = {
            id: jobId,
            createdAt: new Date(),
            status: EJobStatus.PENDING,
            urlCount: job.urls.length,
            successUrlCount: null,
            failedUrlCount: null
        }
        // сохраняет Job
        this.jobs.set(jobId, newJob);

        // сохраняет все задания (url) в цикле со ссылкой на текущую Job
        for (const url of job.urls) {
            const taskId = randomUUID();
            this.tasks.set(taskId, {
                id: taskId,
                url,
                status: ETaskStatus.PENDING,
                jobId,
            })
        }

        // возвращает сохранённую Job
        return newJob;
    }

    // возвращает все Jobs
    async findJobs(): Promise<JobEntity[]> {
        return Array.from(this.jobs.values());
    }

    // возвращает JobEntity по id
    async findJobById(id: string): Promise<JobEntity | undefined> {
        return this.jobs.get(id);
    }

    // возвращает объект job по id, обогащённый его задачами(urls)
    async findFullJobById(id: string): Promise<GetFullJobDTO> {
        // проверяет, что есть такой объект Job
        const job = this.jobs.get(id);
        if (!job) {
            throw new NotFoundError(`Job not found by id: ${id}`);
        }

        // проверяет, что у этого Job есть задачи(urls)
        const tasks = Array.from(this.tasks.values()).filter(task => task.jobId === id);
        if (!tasks.length) {
            throw new NotFoundError(`Tasks for job with id: ${id} not found`);
        }

        // возвращает объект
        return GetFullJobDTO.fromEntity(job, tasks);
    }

    // возвращает задачи(urls) по id JobEntity
    async findTasksByJobId(jobId: string): Promise<TaskEntity[]> {
        return Array.from(this.tasks.values()).filter(task => task.jobId === jobId);
    }

    // меняет статус JobEntity
    async changeJobStatus(jobId: string, status: EJobStatus): Promise<void> {
        const job = this.jobs.get(jobId);
        if (!job) {
            throw new NotFoundError(`Job not found by id: ${jobId}`);
        }
        job.status = status;
    }

    // меняет статус TaskEntity
    async changeTaskStatus(taskId: string, status: ETaskStatus): Promise<void> {
        const task = this.tasks.get(taskId);
        if (!task) {
            throw new NotFoundError(`Task not found by id: ${taskId}`);
        }
        task.status = status;
    }

    // обновляет JobEntity
    async updateJob(job: JobEntity): Promise<void> {
        if (!this.jobs.has(job.id)) {
            throw new NotFoundError(`Job not found by id: ${job.id}`);
        }
        this.jobs.set(job.id, job);
    }
}
