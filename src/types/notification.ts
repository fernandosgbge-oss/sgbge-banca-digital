export type NotificationType =
    | 'loan_request'
    | 'salary_advance'
    | 'balance_alert'
    | 'cash_deposit'
    | 'manager_message'
    | 'security'
    | 'info';

export interface Notification {
    id: string;
    uid: string;
    title: string;
    body: string;
    type: NotificationType;
    createdAt: number; // Timestamp
    readAt: number | null;
    metadata?: Record<string, any>;
}
