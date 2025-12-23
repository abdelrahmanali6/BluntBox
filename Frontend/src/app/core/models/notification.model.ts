export interface NotificationDto {
    id: string;
    type: string;
    referenceId: string;
    title: string;
    body: string;
    isRead: boolean;
    createdAt: string;
    metadata?: any;
}

export interface UnreadCountResponse {
    unreadCount: number;
}
