export const ENotificationType = {
    SUCCESS: 'success',
    WARNING: 'warning',
    ERROR: 'error',
} as const;

export type ENotificationType = typeof ENotificationType[keyof typeof ENotificationType];

export type TNotification = {
    title: string;
    message: string;
    type: ENotificationType;
}

export const useNotification = () => {

    const showNotification = (notification: TNotification) => {
        console.log(notification)
    }

    return { showNotification }
}
