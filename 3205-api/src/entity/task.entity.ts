export enum ETaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    SUCCESS = 'success',
    ERROR = 'error',
    CANCELLED = 'cancelled',
}

export class TaskEntity {
    id: string;
    url: string;
    status: ETaskStatus;
    jobId: string;
    startTime?: Date;
    endTime?: Date;
    executionTimeMs?: number;
    httpStatus?: number;
    errorMessage?: string;
}
