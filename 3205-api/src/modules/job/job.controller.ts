import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { JobService } from './job.service';
import {
  ApiCancelJob,
  ApiCreateJob,
  ApiGetById,
  ApiGetMany,
  ApiJob,
} from './job.swagger';
import { CreateJobDTO, GetFullJobDTO, GetJobDTO } from '../../dto/job.dto';

@ApiJob()
@Controller('jobs')
export class JobController {
  private readonly logger = new Logger(JobController.name);

  constructor(private readonly jobService: JobService) {}

  @ApiCreateJob()
  @Post()
  async createJob(@Body() dto: CreateJobDTO): Promise<GetJobDTO> {
    try {
      const job = await this.jobService.createJob(dto);

      this.logger.log(`Successfully created job with id ${job.id}`);

      return job;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error';
      this.logger.error(`Failed to create job: ${message}`);
      throw new BadRequestException(message);
    }
  }

  @ApiGetMany()
  @Get()
  async getMany(): Promise<GetJobDTO[]> {
    try {
      const jobs = await this.jobService.getAllJobs();

      this.logger.log(`Successfully found ${jobs.length} jobs`);

      return jobs;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error';
      this.logger.error(`Failed to retrieve jobs: ${message}`);
      throw new BadRequestException(message);
    }
  }

  @ApiGetById()
  @Get(':id')
  async getById(@Param('id') id: string): Promise<GetFullJobDTO> {
    try {
      const job = await this.jobService.getFullJob(id);

      this.logger.log(`Successfully found job with id ${id}`);

      return job;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error';
      this.logger.error(`Failed to find job with id ${id}: ${message}`);
      throw new BadRequestException(message);
    }
  }

  @ApiCancelJob()
  @Delete(':id')
  async cancelJob(@Param('id') id: string): Promise<void> {
    try {
      await this.jobService.cancelJob(id);

      this.logger.log(`Successfully canceled job with id ${id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unexpected error';
      this.logger.error(`Failed to cancel job with id ${id}: ${message}`);
      throw new BadRequestException(message);
    }
  }
}
