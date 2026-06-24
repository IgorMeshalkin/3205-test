import { Controller } from '@nestjs/common';
import { JobService } from './job.service';
import { ApiJob } from './job.swagger';

@ApiJob()
@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}
}
