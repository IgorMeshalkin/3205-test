import {Injectable} from '@nestjs/common';
import {DataStorageService} from "../data-storage/data-storage.service";
import {JobWorkerService} from "../job-worker/job-worker.service";
import {TaskWorkerService} from "../job-worker/task-worker.service";
import {CreateJobDTO, GetFullJobDTO, GetJobDTO} from "../../dto/job.dto";
import {EJobStatus} from "../../entity/job.entity";

@Injectable()
export class JobService {
    constructor(
        private readonly jobWorkerService: JobWorkerService,
        private readonly taskWorkerService: TaskWorkerService,
        private readonly dataStorageService: DataStorageService
    ) {
    }

    async createJob(dto: CreateJobDTO): Promise<GetJobDTO> {
        // создаёт JobEntity
        const createdJob = await this.dataStorageService.saveJob(dto);
        // запускает обработку JobEntity
        void this.jobWorkerService.handleJob(createdJob.id);
        // возвращает GetJobDTO
        return GetJobDTO.fromEntity(createdJob);
    }

    async getAllJobs(): Promise<GetJobDTO[]> {
        return await this.dataStorageService.findJobs();
    }

    async getFullJob(id: string): Promise<GetFullJobDTO> {
        return await this.dataStorageService.findFullJobById(id);
    }

    async cancelJob(id: string): Promise<void> {
        const job = await this.dataStorageService.findJobById(id);
        if (!job) {
            throw new Error(`Job with id ${id} not found`);
        }
        if (job.status !== EJobStatus.PENDING && job.status !== EJobStatus.IN_PROGRESS) {
            throw new Error(`Job with id ${id} is not in pending or in progress status and cannot be cancelled`);
        }
        await this.dataStorageService.changeJobStatus(id, EJobStatus.CANCELLED);
    }
}
