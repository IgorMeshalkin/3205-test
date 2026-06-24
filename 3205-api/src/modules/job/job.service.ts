import {Injectable} from '@nestjs/common';
import {DataStorageService} from "../data-storage/data-storage.service";
import {JobWorkerService} from "../job-worker/job-worker.service";
import {TaskWorkerService} from "../job-worker/task-worker.service";

@Injectable()
export class JobService {
    constructor(
        private readonly jobWorkerService: JobWorkerService,
        private readonly taskWorkerService: TaskWorkerService,
        private readonly dataStorageService: DataStorageService
    ) {
    }
}
