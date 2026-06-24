import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateJobDTO, GetFullJobDTO, GetJobDTO } from '../../dto/job.dto';

export function ApiJob() {
  return applyDecorators(ApiTags('Job'));
}

export function ApiCreateJob() {
  return applyDecorators(
    ApiOperation({ summary: 'Create job' }),
    ApiBody({ type: CreateJobDTO }),
    ApiResponse({
      status: 201,
      description: 'Job created successfully.',
      type: GetJobDTO,
    }),
    ApiResponse({
      status: 400,
      description: 'Failed to create job.',
    }),
  );
}

export function ApiGetMany() {
  return applyDecorators(
    ApiOperation({ summary: 'Get jobs' }),
    ApiResponse({
      status: 200,
      description: 'Jobs found successfully.',
      type: [GetJobDTO],
    }),
    ApiResponse({
      status: 400,
      description: 'Failed to retrieve jobs.',
    }),
  );
}

export function ApiGetById() {
  return applyDecorators(
    ApiOperation({ summary: 'Get job by id' }),
    ApiParam({ name: 'id', type: String }),
    ApiResponse({
      status: 200,
      description: 'Job found successfully.',
      type: GetFullJobDTO,
    }),
    ApiResponse({
      status: 400,
      description: 'Failed to find job.',
    }),
  );
}

export function ApiCancelJob() {
  return applyDecorators(
    ApiOperation({ summary: 'Cancel job' }),
    ApiParam({ name: 'id', type: String }),
    ApiResponse({
      status: 200,
      description: 'Job canceled successfully.',
    }),
    ApiResponse({
      status: 400,
      description: 'Failed to cancel job.',
    }),
  );
}
