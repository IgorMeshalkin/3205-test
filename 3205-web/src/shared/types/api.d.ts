export interface paths {
    "/healthcheck": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["AppController_getHealthcheck"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/jobs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get jobs */
        get: operations["JobController_getMany"];
        put?: never;
        /** Create job */
        post: operations["JobController_createJob"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/jobs/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get job by id */
        get: operations["JobController_getById"];
        put?: never;
        post?: never;
        /** Cancel job */
        delete: operations["JobController_cancelJob"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        CreateJobDTO: {
            /**
             * @description List of URLs to process in the job.
             * @example [
             *       "https://example.com",
             *       "https://nestjs.com"
             *     ]
             */
            urls: string[];
        };
        GetJobDTO: {
            /**
             * @description Unique job identifier.
             * @example 550e8400-e29b-41d4-a716-446655440000
             */
            id: string;
            /**
             * Format: date-time
             * @description Date and time when the job was created.
             * @example 2026-06-24T10:15:30.000Z
             */
            createdAt: string;
            /**
             * @description Current job status.
             * @example completed
             * @enum {string}
             */
            status: "pending" | "in_progress" | "completed" | "cancelled" | "failed";
            /**
             * @description Number of URLs processed successfully.
             * @example 8
             */
            successUrlCount: Record<string, never> | null;
            /**
             * @description Number of URLs that failed during processing.
             * @example 2
             */
            failedUrlCount: Record<string, never> | null;
        };
        GetTaskDTO: {
            /**
             * @description URL processed by the task.
             * @example https://example.com
             */
            url: string;
            /**
             * @description Current task status.
             * @example success
             * @enum {string}
             */
            status: "pending" | "in_progress" | "success" | "error" | "cancelled";
            /**
             * Format: date-time
             * @description Date and time when task processing started.
             * @example 2026-06-24T10:15:30.000Z
             */
            startTime?: string;
            /**
             * Format: date-time
             * @description Date and time when task processing ended.
             * @example 2026-06-24T10:15:31.250Z
             */
            endTime?: string;
            /**
             * @description Task execution time in milliseconds.
             * @example 1250
             */
            executionTimeMs?: number;
            /**
             * @description HTTP status code returned by the URL request.
             * @example 200
             */
            httpStatus?: number;
            /**
             * @description Error message when task processing fails.
             * @example Request timeout
             */
            errorMessage?: string;
        };
        GetFullJobDTO: {
            /**
             * @description Unique job identifier.
             * @example 550e8400-e29b-41d4-a716-446655440000
             */
            id: string;
            /**
             * Format: date-time
             * @description Date and time when the job was created.
             * @example 2026-06-24T10:15:30.000Z
             */
            createdAt: string;
            /**
             * @description Current job status.
             * @example completed
             * @enum {string}
             */
            status: "pending" | "in_progress" | "completed" | "cancelled" | "failed";
            /**
             * @description Number of URLs processed successfully.
             * @example 8
             */
            successUrlCount: Record<string, never> | null;
            /**
             * @description Number of URLs that failed during processing.
             * @example 2
             */
            failedUrlCount: Record<string, never> | null;
            /** @description List of tasks included in the job. */
            tasks: components["schemas"]["GetTaskDTO"][];
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    AppController_getHealthcheck: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    JobController_getMany: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Jobs found successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GetJobDTO"][];
                };
            };
            /** @description Failed to retrieve jobs. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    JobController_createJob: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateJobDTO"];
            };
        };
        responses: {
            /** @description Job created successfully. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GetJobDTO"];
                };
            };
            /** @description Failed to create job. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    JobController_getById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Job found successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GetFullJobDTO"];
                };
            };
            /** @description Failed to find job. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    JobController_cancelJob: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Job canceled successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Failed to cancel job. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
