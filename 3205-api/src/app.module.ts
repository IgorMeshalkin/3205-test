import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataStorageModule } from './modules/data-storage/data-storage.module';
import { JobModule } from './modules/job/job.module';
import { JobWorkerModule } from './modules/job-worker/job-worker.module';

@Module({
  imports: [ConfigModule.forRoot(), DataStorageModule, JobModule, JobWorkerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
