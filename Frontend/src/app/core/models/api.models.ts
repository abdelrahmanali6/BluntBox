export interface RegisterRequest {
    userName: string;
    email: string;
    password: string;
    displayName: string | null;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
}

export interface MessageCreateDto {
    recipientUserId: string;
    content: string;
    isPublic: boolean;
    senderIp?: string | null;
    language?: string | null;
}

export interface UserPublic {
    id: string;
    userName: string;
    displayName?: string | null;
    isPrivateAccount: boolean;
    linkSlug?: string | null;
}

export interface MessageDto {
    id: string;
    recipientUserId: string;
    content: string;
    isPublic: boolean;
    isReplied: boolean;
    sentAt: string;
    senderIp: string | null;
    language?: string | null;
    moderationStatus: ModerationStatus;
    sentimentScore: number | null;
}

export interface ReplyDto {
    id: string;
    messageId: string;
    replierUserId: string;
    content: string;
    isPublic: boolean;
    createdAt: string;
}

export interface MessageWithReplies {
    message: MessageDto;
    replies: ReplyDto[];
}

export enum ModerationStatus {
    Pending = 0,
    Approved = 1,
    Blocked = 2
}
