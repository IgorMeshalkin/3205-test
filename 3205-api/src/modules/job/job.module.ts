import {Module} from '@nestjs/common';
import {JobController} from './job.controller';
import {JobService} from './job.service';
import {JobWorkerModule} from "../job-worker/job-worker.module";
import {DataStorageModule} from "../data-storage/data-storage.module";

@Module({
    imports: [JobWorkerModule, DataStorageModule],
    controllers: [JobController],
    providers: [JobService],
})
export class JobModule {
}
