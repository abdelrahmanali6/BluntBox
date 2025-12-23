import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Bell, MessageSquare, Trash2, CheckCircle, Clock, CheckCheck, Inbox } from 'lucide-angular';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationDto } from '../../core/models/notification.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, NavbarComponent, FooterComponent],
  template: `
    <div class="min-vh-100 d-flex flex-column bg-background position-relative overflow-hidden">
      <!-- Global background elements -->
      <div class="position-absolute top-0 start-0 w-100 h-100 bg-dot-pattern pointer-events-none" style="z-index: 0;"></div>
      <div class="ambient-blob primary" style="top: -10%; right: -10%; opacity: 0.1;"></div>
      <div class="ambient-blob secondary" style="bottom: -10%; left: -10%; opacity: 0.1;"></div>

      <app-navbar></app-navbar>

      <main class="flex-grow-1 container py-5 position-relative z-1">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            
            <!-- Header -->
            <div class="d-flex justify-content-between align-items-end mb-4 pt-2">
              <div>
                <h1 class="display-6 fw-bold text-foreground mb-1">Notifications</h1>
                <p class="text-text-soft mb-0">Stay updated with your latest message activity</p>
              </div>
              <button *ngIf="notificationService.unreadCount() > 0" 
                      (click)="markAllAsRead()"
                      class="btn btn-hero btn-sm px-4 d-flex align-items-center gap-2 shadow-primary-glow">
                <lucide-icon [name]="icons.CheckCheck" [size]="16"></lucide-icon>
                Mark all read
              </button>
            </div>

            <!-- Notifications List -->
            <div class="card glassmorphism border-border-soft shadow-sm overflow-hidden rounded-4">
              <ng-container *ngIf="notificationService.notifications() as notifications; else loading">
                
                <div *ngIf="notifications.length === 0" class="p-5 text-center fade-in py-5">
                  <div class="mb-4 d-inline-flex p-4 rounded-5 bg-primary-subtle text-primary border border-primary-subtle pulse-animation">
                    <lucide-icon [name]="icons.Inbox" [size]="56"></lucide-icon>
                  </div>
                  <h3 class="h3 fw-bold text-foreground mb-2">Your inbox is clear</h3>
                  <p class="text-text-soft mb-0 mx-auto lead fs-6 opacity-80" style="max-width: 320px;">
                    When you receive new messages or activity, they'll show up here.
                  </p>
                </div>

                <div *ngFor="let n of notifications; let i = index" 
                     (click)="handleNotificationClick(n)"
                     class="notification-item p-4 border-bottom border-border-soft cursor-pointer transition-all position-relative hover-translate-x"
                     [ngClass]="{'bg-primary-subtle-glow unread-border': !n.isRead, 'glass-hover': n.isRead}"
                     [style.animation-delay]="(i * 0.05) + 's'">
                  
                  <div class="d-flex gap-4">
                    <!-- Icon -->
                    <div class="p-3 rounded-4 flex-shrink-0 d-flex align-items-center justify-content-center shadow-sm" 
                         [ngClass]="!n.isRead ? 'bg-primary-glow text-white' : 'bg-background-soft text-text-soft'"
                         style="width: 52px; height: 52px;">
                      <lucide-icon [name]="icons.MessageSquare" [size]="24"></lucide-icon>
                    </div>

                    <!-- Content -->
                    <div class="flex-grow-1 min-w-0">
                      <div class="d-flex justify-content-between align-items-start mb-1 gap-3">
                        <h4 class="h6 fw-bold text-foreground mb-0 text-truncate">{{ n.title }}</h4>
                        <div class="d-flex align-items-center gap-2 text-text-whisper extra-small fw-medium flex-shrink-0">
                          <lucide-icon [name]="icons.Clock" [size]="12"></lucide-icon>
                          {{ getTimeAgo(n.createdAt) }}
                        </div>
                      </div>
                      <p class="text-text-soft mb-0 line-clamp-2 pe-md-5 small opacity-90">{{ n.body }}</p>
                    </div>

                    <!-- Status Dot (Mobile Only) -->
                    <div *ngIf="!n.isRead" class="unread-dot position-absolute top-50 translate-middle-y end-0 me-4"></div>
                  </div>
                </div>

              </ng-container>

              <ng-template #loading>
                <div class="p-5 text-center py-5">
                  <div class="spinner-border text-primary mb-3" role="status"></div>
                  <p class="text-text-soft small">Checking for updates...</p>
                </div>
              </ng-template>
            </div>

            <!-- Footer Info -->
            <p class="text-center text-text-whisper extra-small mt-4 opacity-50">
              Notifications are preserved for 30 days. Stay blunt!
            </p>

          </div>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .notification-item { transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .notification-item:last-child { border-bottom: none !important; }
    .notification-item.unread-border::before {
      content: '';
      position: absolute;
      left: 0;
      top: 15%;
      bottom: 15%;
      width: 4px;
      background-color: hsl(var(--primary));
      border-radius: 0 4px 4px 0;
      box-shadow: 2px 0 10px hsl(var(--primary) / 0.3);
    }
    .hover-translate-x:hover { transform: translateX(8px); }
    .bg-primary-glow { background: hsl(var(--primary)); box-shadow: 0 0 15px hsl(var(--primary) / 0.4); }
    .bg-primary-subtle-glow { background-color: hsl(var(--primary) / 0.05) !important; }
    .bg-primary-subtle { background-color: hsl(var(--primary) / 0.1) !important; color: hsl(var(--primary)); }
    .border-border-soft { border-color: hsl(var(--border) / 0.4) !important; }
    .bg-background-soft { background-color: rgba(255, 255, 255, 0.05); }
    .unread-dot {
      width: 10px;
      height: 10px;
      background-color: hsl(var(--primary));
      border-radius: 50%;
      box-shadow: 0 0 12px hsl(var(--primary) / 0.8);
    }
    .extra-small { font-size: 0.75rem; }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class NotificationsComponent implements OnInit {
  public notificationService = inject(NotificationService);
  private router = inject(Router);

  readonly icons = { Bell, MessageSquare, Trash2, CheckCircle, Clock, CheckCheck, Inbox };

  ngOnInit() {
    this.notificationService.fetchNotifications();
  }

  markAllAsRead() {
    this.notificationService.markAllRead();
  }

  handleNotificationClick(n: NotificationDto) {
    if (!n.isRead) {
      this.notificationService.markRead(n.id);
    }
    if (n.referenceId) {
      this.router.navigate(['/message', n.referenceId], {
        queryParams: { from: 'notifications' }
      });
    }
  }

  getTimeAgo(date: string): string {
    if (!date) return '...';
    let dateStr = date;
    if (!date.includes('Z') && !date.includes('+')) dateStr += 'Z';
    const now = new Date();
    const then = new Date(dateStr);
    if (isNaN(then.getTime())) return 'recent';
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    if (diffInSeconds < 0) return 'now';
    if (diffInSeconds < 60) return `now`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return then.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }
}
