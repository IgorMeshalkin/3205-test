import { Injectable } from '@nestjs/common';
import {DataStorageService} from "../data-storage/data-storage.service";

@Injectable()
export class TaskWorkerService {
    constructor(private readonly dataStorageService: DataStorageService) {
    }
}