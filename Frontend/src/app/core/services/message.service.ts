import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';
import { MessageCreateDto, MessageDto } from '../models/api.models';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private apiUrl = `${environment.apiUrl}/api`;

    constructor(private http: HttpClient) { }

    sendMessage(payload: MessageCreateDto): Observable<MessageDto> {
        return this.http.post<MessageDto>(`${this.apiUrl}/message`, payload);
    }

    getPublicMessages(recipientUserId: string): Observable<MessageDto[]> {
        return this.http.get<MessageDto[]>(`${this.apiUrl}/publicmessage/${recipientUserId}`);
    }

    replyToMessage(messageId: string, payload: MessageCreateDto): Observable<{ success: boolean }> {
        return this.http.post<{ success: boolean }>(`${this.apiUrl}/message/reply/${messageId}`, payload);
    }
}
