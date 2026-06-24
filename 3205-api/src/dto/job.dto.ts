import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum EJobStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    FAILED = 'failed',
}

export enum ETaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    SUCCESS = 'success',
    ERROR = 'error',
    CANCELLED = 'cancelled',
}

export class CreateJobDTO {
    @ApiProperty({
        description: 'List of URLs to process in the job.',
        example: ['https://example.com', 'https://nestjs.com'],
        type: [String],
    })
    urls: string[];
}

export class GetJobDTO {
    @ApiProperty({
        description: 'Unique job identifier.',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    id: string;

    @ApiProperty({
        description: 'Date and time when the job was created.',
        example: '2026-06-24T10:15:30.000Z',
        type: String,
        format: 'date-time',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Current job status.',
        enum: EJobStatus,
        example: EJobStatus.COMPLETED,
    })
    status: EJobStatus;

    @ApiProperty({
        description: 'Number of URLs processed successfully.',
        example: 8,
    })
    successUrlCount: number;

    @ApiProperty({
        description: 'Number of URLs that failed during processing.',
        example: 2,
    })
    failedUrlCount: number;
}

export class GetTaskDTO {
    @ApiProperty({
        description: 'URL processed by the task.',
        example: 'https://example.com',
    })
    url: string;

    @ApiProperty({
        description: 'Current task status.',
        enum: ETaskStatus,
        example: ETaskStatus.SUCCESS,
    })
    status: ETaskStatus;

    @ApiProperty({
        description: 'Date and time when task processing started.',
        example: '2026-06-24T10:15:30.000Z',
        type: String,
        format: 'date-time',
    })
    startTime: Date;

    @ApiProperty({
        description: 'Date and time when task processing ended.',
        example: '2026-06-24T10:15:31.250Z',
        type: String,
        format: 'date-time',
    })
    endTime: Date;

    @ApiProperty({
        description: 'Task processing duration in milliseconds.',
        example: 1250,
    })
    duration: number;

    @ApiPropertyOptional({
        description: 'HTTP status code returned by the URL request.',
        example: 200,
    })
    httpStatus?: number;

    @ApiPropertyOptional({
        description: 'Error message when task processing fails.',
        example: 'Request timeout',
    })
    errorMessage?: string;
}

export class GetFullJobDTO extends GetJobDTO {
    @ApiProperty({
        description: 'List of tasks included in the job.',
        type: [GetTaskDTO],
    })
    tasks: GetTaskDTO[];
}
