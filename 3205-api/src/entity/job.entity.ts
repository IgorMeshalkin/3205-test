import {ApiProperty} from "@nestjs/swagger";

export enum EJobStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    FAILED = 'failed',
}

export class JobEntity {
    id: string;
    createdAt: Date;
    status: EJobStatus;
    urlCount: number;
    successUrlCount: number | null;
    failedUrlCount: number | null;
}