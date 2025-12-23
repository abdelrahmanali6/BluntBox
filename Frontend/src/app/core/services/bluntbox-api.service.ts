import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environment';
import { MessageDto, MessageWithReplies, UserPublic } from '../models/api.models';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class BluntboxApiService {
    private apiUrl = `${environment.apiUrl}/api`;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    getUserByUsername(username: string): Observable<UserPublic> {
        return this.http.get<UserPublic>(`${this.apiUrl}/users/by-username/${encodeURIComponent(username)}`)
            .pipe(catchError(this.handleError));
    }

    getUserBySlug(slug: string): Observable<UserPublic> {
        return this.http.get<UserPublic>(`${this.apiUrl}/users/by-slug/${encodeURIComponent(slug)}`)
            .pipe(catchError(this.handleError));
    }

    getReceivedMessages(): Observable<MessageDto[]> {
        // AuthInterceptor will handle the token
        return this.http.get<MessageDto[]>(`${this.apiUrl}/messages/received`)
            .pipe(catchError(this.handleError));
    }

    getMessageWithReplies(messageId: string): Observable<MessageWithReplies> {
        return this.http.get<MessageWithReplies>(`${this.apiUrl}/messages/${messageId}`)
            .pipe(catchError(this.handleError));
    }

    getPublicMessages(recipientUserId: string): Observable<MessageDto[]> {
        return this.http.get<MessageDto[]>(`${this.apiUrl}/messages/public/${recipientUserId}`)
            .pipe(catchError(this.handleError));
    }

    replyToMessage(messageId: string, payload: { content: string, isPublic: boolean, recipientUserId: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/message/reply/${messageId}`, payload)
            .pipe(catchError(this.handleError));
    }

    changePassword(payload: { currentPassword: string, newPassword: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/change-password`, payload)
            .pipe(catchError(this.handleError));
    }

    private handleError(err: HttpErrorResponse) {
        // If 401, clear token using AuthService (which handles state)
        if (err.status === 401) {
            // We can inject AuthService to clear state, but circular dep risk if AuthService uses API service.
            // Since AuthService only uses Http and not this service, it should be fine.
            // NOTE: Ideally this logic belongs in an ErrorInterceptor or AuthInterceptor response handling.
            localStorage.removeItem('bluntbox_token');
        }

        // Return objects matching { status, body } as requested
        const errObj = { status: err.status, body: err.error };
        return throwError(() => errObj);
    }
}
