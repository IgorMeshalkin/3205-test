import {Injectable, Logger} from '@nestjs/common';
import {DataStorageService} from '../data-storage/data-storage.service';
import {EJobStatus} from '../../entity/job.entity';
import {ETaskStatus, TaskEntity} from "../../entity/task.entity";

@Injectable()
export class JobWorkerService {
    // по сколько url в задаче выполняется асинхронно за раз
    private readonly CHUNK_TASKS_SIZE = 5;
    // минимальное время выполнения задачи
    private readonly TASK_MIN_MS = 0;
    // максимальное время выполнения задачи
    private readonly TASK_MAX_MS = 10 * 1000;

    private readonly logger = new Logger(JobWorkerService.name);

    constructor(private readonly dataStorageService: DataStorageService) {
    }

    async handleJob(id: string): Promise<void> {
        try {
            // проверяет Job на существование
            const job = await this.dataStorageService.findJobById(id);
            if (!job) {
                this.logger.error(`Job with id ${id} not found`);
                return;
            }
            // проверяет статус Job, на готовность к обработке
            if (job.status !== EJobStatus.PENDING) {
                this.logger.error(`Job with id ${id} is not in pending status and cannot be handled`);
                return;
            }

            // получает задачи(urls) текущего Job, проверяет что их > 0
            const tasks = await this.dataStorageService.findTasksByJobId(id);
            if (tasks.length === 0) {
                this.logger.error(`No tasks found for job with id ${id}, cannot handle`);
                return;
            }

            // ставит Job в статус IN_PROGRESS
            await this.dataStorageService.changeJobStatus(id, EJobStatus.IN_PROGRESS);

            // выполняет задачи(urls) частями по CHUNK_TASKS_SIZE
            for (let i = 0; i < tasks.length; i += this.CHUNK_TASKS_SIZE) {
                const chunk = tasks.slice(i, i + this.CHUNK_TASKS_SIZE);
                await Promise.allSettled(
                    chunk.map(async task => {
                        console.log(task);
                    }),
                );

                // проверяет не отменил ли пользователь выполнение, если нет запускает следующий CHUNK
                const currentJob = await this.dataStorageService.findJobById(id);
                if (currentJob!.status === EJobStatus.CANCELLED) {
                    void this.handleCancel(id, chunk);
                    this.logger.log(`Job with id ${id} was cancelled, stopping job handling`);
                    return;
                }
            }

            // В случае успешного завершения обработки
            const currentJob = await this.dataStorageService.findJobById(id);
            if (currentJob && currentJob.status === EJobStatus.IN_PROGRESS) {
                const tasks = await this.dataStorageService.findTasksByJobId(id);
                const successUrlCount = tasks.filter(task => task.status === ETaskStatus.SUCCESS).length;

                // обновляет успешно обработанную JobEntity
                await this.dataStorageService.updateJob({
                    ...currentJob,
                    status: EJobStatus.COMPLETED,
                    successUrlCount,
                    failedUrlCount: tasks.length - successUrlCount,
                });
            }
        } catch (error) {
            // в случае ошибки ставит JobEntity в статус FAILED
            await this.dataStorageService.changeJobStatus(id, EJobStatus.FAILED);
            this.logger.error(`Error handling job with id ${id}:`, error);
        }
    }

    async handleCancel(jobId: string, currentChunk: TaskEntity[]): Promise<void> {
        // выжидает максимальное время выполнения таски, чтобы присвоить всем задачам(urls) текущей чанки статус CANCELLED
        // т.к. пользователь отменил задачу во время их выполнения.
        await new Promise(resolve => setTimeout(resolve, this.TASK_MAX_MS + 100));

        // всем задачам(url) которые обрабатывались, в момент отмены Job
        // присваивает статус CANCELLED
        for (const task of currentChunk) {
            try {
                await this.dataStorageService.changeTaskStatus(task.id, ETaskStatus.CANCELLED);
            } catch (error) {
                this.logger.error(`Error changing task status to CANCELLED for task with id ${task.id}:`, error);
            }
        }
    }
}
