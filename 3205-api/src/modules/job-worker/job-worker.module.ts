import {Module} from '@nestjs/common';
import {JobWorkerService} from './job-worker.service';
import {DataStorageModule} from "../data-storage/data-storage.module";
import {TaskWorkerService} from "./task-worker.service";

@Module({
    imports: [DataStorageModule],
    providers: [JobWorkerService, TaskWorkerService],
    exports: [JobWorkerService, TaskWorkerService],
})
export class JobWorkerModule {
}
