import {Injectable, Logger} from '@nestjs/common';
import {DataStorageService} from "../data-storage/data-storage.service";
import {ETaskStatus, TaskEntity} from "../../entity/task.entity";

@Injectable()
export class TaskWorkerService {
    private readonly logger = new Logger(TaskWorkerService.name);

    constructor(private readonly dataStorageService: DataStorageService) {
    }

    async handleTask(task: TaskEntity, minMs: number, maxMs: number): Promise<void> {
        // ставит TaskEntity в статус IN_PROGRESS
        await this.dataStorageService.changeTaskStatus(task.id, ETaskStatus.IN_PROGRESS);

        // время начала работы над задачей
        const startTime = new Date();

        try {
            // проверка url
            const response = await fetch(task.url, {
                method: 'HEAD',
            });
            // ответ успешный или нет
            const isSuccess = response.ok;

            // искусственная задержка от minMs до maxMs
            const delayMs = Math.random() * (maxMs - minMs) + minMs;
            await new Promise(resolve => setTimeout(resolve, delayMs));

            // время окончания работы над задачей
            const endTime = new Date();

            // сохраняет результат обработки
            await this.dataStorageService.updateTask({
                ...task,
                startTime,
                endTime,
                executionTimeMs: endTime.getTime() - startTime.getTime(),
                httpStatus: response.status,
                status: isSuccess ? ETaskStatus.SUCCESS : ETaskStatus.ERROR
            })

        } catch (error) {
            // время ошибки при работе над задачей
            const endTime = new Date();

            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            // в случае ошибки ставит TaskEntity в статус ERROR и фиксирует ошибку
            await this.dataStorageService.updateTask({
                ...task,
                status: ETaskStatus.ERROR,
                errorMessage: errorMessage,
                startTime,
                endTime,
                executionTimeMs: endTime.getTime() - startTime.getTime(),
            });
            this.logger.error(`Error handling task with id ${task.id}:`, errorMessage);
        }
    }
}
