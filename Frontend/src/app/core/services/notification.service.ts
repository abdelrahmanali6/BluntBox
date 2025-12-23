import { Injectable, inject, signal, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { catchError, map, tap, retry, shareReplay } from 'rxjs/operators';
import { toObservable } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './auth.service';
import { NotificationDto, UnreadCountResponse } from '../models/notification.model';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private http = inject(HttpClient);
    private auth = inject(AuthService);
    private router = inject(Router);
    private translate = inject(TranslateService);

    private hubConnection: signalR.HubConnection | null = null;

    // State using Signals for better reactivity
    private notificationsSignal = signal<NotificationDto[]>([]);
    notifications = this.notificationsSignal.asReadonly();
    notifications$ = toObservable(this.notifications);

    private unreadCountSignal = signal<number>(0);
    unreadCount = this.unreadCountSignal.asReadonly();
    unreadCount$ = toObservable(this.unreadCount);

    constructor() {
        // React to auth state changes
        effect(() => {
            const user = this.auth.currentUser();
            if (user) {
                this.startConnection();
                this.fetchUnreadCount();
                this.fetchNotifications(); // Also fetch notifications to sync unread count locally
            } else {
                this.stopConnection();
                this.notificationsSignal.set([]);
                this.unreadCountSignal.set(0);
            }
        });
    }

    private startConnection() {
        if (this.hubConnection) return;

        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('/hubs/notifications', {
                accessTokenFactory: () => this.auth.getToken() || ''
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.on('notification', (notification: NotificationDto) => {
            console.log('SignalR: New notification', notification);
            this.addNotification(notification);
        });

        this.hubConnection.start()
            .then(() => console.log('SignalR Connection Started'))
            .catch(err => console.error('Error while starting SignalR connection: ' + err));

        this.hubConnection.onreconnected(() => {
            console.log('SignalR Reconnected. Syncing notifications...');
            this.fetchNotifications();
            this.fetchUnreadCount();
        });
    }

    private stopConnection() {
        if (this.hubConnection) {
            this.hubConnection.stop();
            this.hubConnection = null;
        }
    }

    private addNotification(notification: NotificationDto) {
        console.log('Adding notification to list:', notification);
        const transformed = this.transformNotification(notification);
        this.notificationsSignal.update(prev => [transformed, ...prev]);

        if (!transformed.isRead) {
            console.log('Incrementing unread count from SignalR');
            this.unreadCountSignal.update(count => count + 1);
        }

        this.showToast(transformed);
    }

    private showToast(notification: NotificationDto) {
        console.log(`[TOAST] ${notification.title}: ${notification.body}`);
    }

    fetchNotifications(): Promise<void> {
        return new Promise((resolve, reject) => {
            console.log('Fetching notifications...');
            this.http.get<NotificationDto[]>('/api/notifications')
                .pipe(
                    retry(3),
                    map(msgs => msgs.map(n => this.transformNotification(n))),
                    tap(msgs => {
                        console.log('Fetched notifications count:', msgs.length);
                        this.notificationsSignal.set(msgs);
                        // Recalculate unread count from list to be sure
                        const unread = msgs.filter(m => !m.isRead).length;
                        console.log('Calculated unread from list:', unread);
                        this.unreadCountSignal.set(unread);
                    }),
                    catchError(err => {
                        console.error('Failed to fetch notifications', err);
                        return of([]);
                    })
                )
                .subscribe(() => resolve(), err => reject(err));
        });
    }

    fetchUnreadCount(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.http.get<UnreadCountResponse>('/api/notifications/unread-count')
                .pipe(
                    retry(3),
                    tap(res => {
                        console.log('RAW Unread Count Response:', res);
                        // If res.unreadCount is undefined but res has a value, check other fields
                        const count = res.unreadCount ?? (res as any).count ?? 0;
                        console.log('Resolved unread count:', count);
                        this.unreadCountSignal.set(count);
                    }),
                    catchError(err => {
                        console.error('Failed to fetch unread count', err);
                        return of({ unreadCount: 0 });
                    })
                )
                .subscribe(() => resolve(), err => reject(err));
        });
    }

    markRead(id: string): Promise<void> {
        this.notificationsSignal.update(current =>
            current.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
        this.unreadCountSignal.update(count => Math.max(0, count - 1));

        return new Promise((resolve, reject) => {
            this.http.post(`/api/notifications/mark-read`, { id })
                .subscribe(() => resolve(), err => reject(err));
        });
    }

    markAllRead(): Promise<void> {
        console.log('Marking all read...');
        this.notificationsSignal.update(current =>
            current.map(n => ({ ...n, isRead: true }))
        );
        this.unreadCountSignal.set(0);

        return new Promise((resolve, reject) => {
            this.http.post(`/api/notifications/mark-all-read`, {})
                .subscribe(() => {
                    console.log('Server: All notifications marked as read');
                    resolve();
                }, err => {
                    console.error('Failed to mark all as read on server', err);
                    reject(err);
                });
        });
    }

    private transformNotification(n: NotificationDto): NotificationDto {
        // If server sent localized content already, use it
        if ((n as any).localizedTitle) n.title = (n as any).localizedTitle;
        if ((n as any).localizedBody) n.body = (n as any).localizedBody;

        // Fallback to client-side translation if keys match standard patterns
        if (n.title.toLowerCase() === 'new approved message' || n.title === 'NOTIFICATION_NEW_MESSAGE') {
            n.title = this.translate.instant('NOTIFICATIONS.NEW_MESSAGE');
        }
        if (n.body.toLowerCase().includes('approved') || n.body === 'NOTIFICATION_NEW_MESSAGE_BODY') {
            n.body = this.translate.instant('NOTIFICATIONS.NEW_MESSAGE_BODY');
        }

        return n;
    }
}
