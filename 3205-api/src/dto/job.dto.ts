import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {EJobStatus, JobEntity} from "../entity/job.entity";
import {ETaskStatus, TaskEntity} from "../entity/task.entity";

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
        nullable: true,
    })
    successUrlCount: number | null;

    @ApiProperty({
        description: 'Number of URLs that failed during processing.',
        example: 2,
        nullable: true,
    })
    failedUrlCount: number | null;

    static fromEntity(entity: JobEntity): GetJobDTO {
        const dto = new GetJobDTO();
        dto.id = entity.id;
        dto.createdAt = entity.createdAt;
        dto.status = entity.status;
        dto.successUrlCount = entity.successUrlCount;
        dto.failedUrlCount = entity.failedUrlCount;
        return dto;
    }
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

    @ApiPropertyOptional({
        description: 'Date and time when task processing started.',
        example: '2026-06-24T10:15:30.000Z',
        type: String,
        format: 'date-time',
    })
    startTime?: Date;

    @ApiPropertyOptional({
        description: 'Date and time when task processing ended.',
        example: '2026-06-24T10:15:31.250Z',
        type: String,
        format: 'date-time',
    })
    endTime?: Date;

    @ApiPropertyOptional({
        description: 'Task execution time in milliseconds.',
        example: 1250,
    })
    executionTimeMs?: number;

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

    static fromEntity(entity: TaskEntity): GetTaskDTO {
        const dto = new GetTaskDTO();
        dto.url = entity.url;
        dto.status = entity.status;
        dto.startTime = entity.startTime;
        dto.endTime = entity.endTime;
        dto.executionTimeMs = entity.executionTimeMs;
        dto.httpStatus = entity.httpStatus;
        dto.errorMessage = entity.errorMessage;
        return dto;
    }
}

export class GetFullJobDTO extends GetJobDTO {
    @ApiProperty({
        description: 'List of tasks included in the job.',
        type: [GetTaskDTO],
    })
    tasks: GetTaskDTO[];

    static fromEntity(job: JobEntity, tasks: TaskEntity[] = []): GetFullJobDTO {
        const jobDTO = GetJobDTO.fromEntity(job);
        const tasksDTO = tasks.map(task => GetTaskDTO.fromEntity(task));
        return {
            ...jobDTO,
            tasks: tasksDTO,
        }
    }
}
