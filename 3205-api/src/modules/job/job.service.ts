import {Injectable} from '@nestjs/common';
import {DataStorageService} from "../data-storage/data-storage.service";
import {JobWorkerService} from "../job-worker/job-worker.service";
import {TaskWorkerService} from "../job-worker/task-worker.service";
import {CreateJobDTO, GetFullJobDTO, GetJobDTO} from "../../dto/job.dto";

@Injectable()
export class JobService {
    constructor(
        private readonly jobWorkerService: JobWorkerService,
        private readonly taskWorkerService: TaskWorkerService,
        private readonly dataStorageService: DataStorageService
    ) {
    }

    async createJob(dto: CreateJobDTO): Promise<GetJobDTO> {
        return await this.dataStorageService.saveJob(dto);
    }

    async getAllJobs(): Promise<GetJobDTO[]> {
        return await this.dataStorageService.findJobs();
    }

    async getFullJob(id: string): Promise<GetFullJobDTO> {
        return await this.dataStorageService.findJobById(id);
    }

    async cancelJob(id: string): Promise<void> {
        // TODO implement
    }
}
