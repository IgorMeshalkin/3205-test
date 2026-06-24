import { Injectable } from '@nestjs/common';
import {TaskWorkerService} from "./task-worker.service";
import {DataStorageService} from "../data-storage/data-storage.service";

@Injectable()
export class JobWorkerService {
    constructor(private readonly taskWorkerService: TaskWorkerService, private readonly dataStorageService: DataStorageService) {
    }
}
