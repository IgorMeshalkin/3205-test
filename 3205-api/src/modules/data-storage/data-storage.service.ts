import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {CreateJobDTO, GetFullJobDTO} from "../../dto/job.dto";
import {EJobStatus, JobEntity} from "../../entity/job.entity";
import {ETaskStatus, TaskEntity} from "../../entity/task.entity";
import {NotFoundError} from "rxjs";

@Injectable()
export class DataStorageService {
    private jobs: JobEntity[] = [];
    private tasks: TaskEntity[] = [];
    
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
        this.jobs.push(newJob);

        // сохраняет все задания (url) в цикле со ссылкой на текущую Job
        for (const url of job.urls) {
            const taskId = randomUUID();
            this.tasks.push({
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
        return this.jobs;
    }

    // возвращает объект job по id, обогащённый его задачами(urls)
    async findJobById(id: string): Promise<GetFullJobDTO> {
        // проверяет, что есть такой объект Job
        const job = this.jobs.find(job => job.id === id);
        if (!job) {
            throw new NotFoundError(`Job not found by id: ${id}`);
        }

        // проверяет, что у этого Job есть задачи(urls)
        const tasks = this.tasks.filter(task => task.jobId === id);
        if (!tasks.length) {
            throw new NotFoundError(`Tasks for job with id: ${id} not found`);
        }

        // возвращает объект
        return GetFullJobDTO.fromEntity(job, tasks);
    }
}
