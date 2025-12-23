import { Component, inject, signal, ElementRef, HostListener, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, Bell, CheckCheck, Inbox, MessageSquare } from 'lucide-angular';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationDto } from '../../core/models/notification.model';

@Component({
    selector: 'app-notifications-dropdown',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, RouterLink],
    template: `
    <div class="position-relative" #dropdownContainer>
        <!-- Toggle Button -->
        <button (click)="toggleDropdown()" class="btn btn-link p-2 text-text-soft hover-text-foreground position-relative border-0 shadow-none" style="overflow: visible !important;">
            <lucide-icon [name]="icons.Bell" [size]="20"></lucide-icon>
            <span *ngIf="notificationService.unreadCount() > 0" 
                  class="unread-badge">
                {{ notificationService.unreadCount() }}
            </span>
        </button>

        <!-- Dropdown Menu -->
        <div *ngIf="isOpen()" class="dropdown-menu show dropdown-menu-end bg-card border-border shadow-2xl p-0 overflow-hidden fade-in" 
             style="width: 320px; inset-inline-end: 0; top: 100%; margin-top: 0.5rem; z-index: 1050;">
            
            <div class="p-3 border-bottom border-border d-flex justify-content-between align-items-center bg-card-soft">
                <h6 class="mb-0 fw-bold text-foreground">Notifications</h6>
            </div>

            <div class="notification-list overflow-auto" style="max-height: 400px;">
                <ng-container *ngIf="dropdownNotifications() as notifications; else loading">
                    <div *ngIf="notifications.length === 0" class="p-5 text-center text-text-soft">
                        <lucide-icon [name]="icons.Inbox" [size]="40" class="opacity-20 mb-2"></lucide-icon>
                        <p class="small mb-0">No new notifications</p>
                    </div>

                    <div *ngFor="let n of notifications" 
                         (click)="handleNotificationClick(n)"
                         class="notification-item p-3 border-bottom border-border cursor-pointer transition-colors bg-primary-subtle unread-border-left">
                        <div class="d-flex gap-3">
                            <div class="bg-primary-subtle text-primary p-2 rounded-circle flex-shrink-0" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
                                <lucide-icon [name]="icons.MessageSquare" [size]="18"></lucide-icon>
                            </div>
                            <div class="flex-grow-1 min-w-0">
                                <div class="d-flex justify-content-between align-items-start mb-1">
                                    <p class="small fw-bold text-foreground mb-0 text-truncate pe-2">{{ n.title }}</p>
                                    <span class="text-text-whisper extra-small flex-shrink-0">{{ getTimeAgo(n.createdAt) }}</span>
                                </div>
                                <p class="small text-text-soft mb-0 text-wrap line-clamp-2">{{ n.body }}</p>
                            </div>
                        </div>
                    </div>
                </ng-container>
                <ng-template #loading>
                    <div class="p-4 text-center">
                        <span class="spinner-border spinner-border-sm text-primary"></span>
                    </div>
                </ng-template>
            </div>

            <div class="p-2 border-top border-border text-center bg-card-soft">
                <a routerLink="/notifications" class="small text-primary text-decoration-none fw-medium">View all activity</a>
            </div>
        </div>
    </div>
  `,
    styles: [`
    .bg-primary-subtle { 
        background-color: hsl(var(--primary) / 0.08) !important; 
        color: hsl(var(--primary)); 
    }
    .unread-badge {
      position: absolute;
      top: 2px;
      right: 2px;
      background-color: #ff4757 !important; /* Bright Red */
      color: white !important;
      font-size: 9px !important;
      font-weight: 800 !important;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1.5px solid #000;
      z-index: 100;
      line-height: 1;
      pointer-events: none;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      animation: badgePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    @keyframes badgePop {
      0% { transform: scale(0); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    .extra-small { font-size: 10px; }
    .notification-item { position: relative; }
    .notification-item.unread-border-left::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background-color: hsl(var(--primary));
    }
    .notification-item:hover { background-color: rgba(255, 255, 255, 0.03); }
    .bg-card-soft { background-color: rgba(255, 255, 255, 0.02); }
    .hover-bg-card-soft:hover { background-color: rgba(255, 255, 255, 0.04); }
    .notification-list {
      max-height: 400px;
      overflow-y: auto;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none;  /* IE/Edge */
    }
    .notification-list::-webkit-scrollbar {
      display: none; /* Chrome/Safari/Webkit */
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class NotificationsDropdownComponent {
    public notificationService = inject(NotificationService);
    private router = inject(Router);
    private elementRef = inject(ElementRef);

    readonly icons = { Bell, CheckCheck, Inbox, MessageSquare };

    isOpen = signal(false);
    dropdownNotifications = signal<NotificationDto[]>([]);

    constructor() { }

    toggleDropdown() {
        const newState = !this.isOpen();
        this.isOpen.set(newState);
        if (newState) {
            // Filter only unread messages to show in the dropdown
            const unread = this.notificationService.notifications().filter(n => !n.isRead);
            this.dropdownNotifications.set(unread);

            // Clear the unread count/badge immediately on click
            this.notificationService.markAllRead();
        }
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen.set(false);
        }
    }

    markAllAsRead(event: Event) {
        event.stopPropagation();
        this.notificationService.markAllRead();
    }

    handleNotificationClick(n: NotificationDto) {
        this.isOpen.set(false);
        if (!n.isRead) {
            this.notificationService.markRead(n.id);
        }

        // Navigation based on referenceId
        if (n.referenceId) {
            this.router.navigate(['/message', n.referenceId], {
                queryParams: { from: 'notifications' }
            });
        }
    }

    getTimeAgo(date: string): string {
        if (!date) return '...';

        // Ensure the date is treated as UTC if it doesn't have a timezone indicator
        let dateStr = date;
        if (!date.includes('Z') && !date.includes('+')) {
            dateStr += 'Z';
        }

        const now = new Date();
        const then = new Date(dateStr);

        // If 'then' is invalid, fallback
        if (isNaN(then.getTime())) return 'recent';

        const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);

        // Handle negative diff (clock skew or "just now" from server)
        if (diffInSeconds < 0) return 'now';

        if (diffInSeconds < 60) return `now`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
        return then.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
}
