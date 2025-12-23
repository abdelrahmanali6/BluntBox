import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BluntboxApiService } from '../../core/services/bluntbox-api.service';
import { MessageDto, ModerationStatus } from '../../core/models/api.models';
import {
    LucideAngularModule, LogOut, MessageSquare, ChevronRight, Copy, Eye,
    BarChart3, Lock, Globe, Ghost, Heart, Info, Github, Settings, HelpCircle, Shield
} from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, RouterLink, FooterComponent, NavbarComponent, TranslateModule],
    template: `
    <div class="min-vh-100 bg-background d-flex flex-column position-relative overflow-hidden">
      <!-- Background texture & Ambient effects -->
      <div class="position-absolute top-0 start-0 w-100 h-100 bg-dot-pattern pointer-events-none" style="z-index: 0;"></div>
      <div class="ambient-blob primary" style="top: -10%; right: -10%; opacity: 0.08;"></div>
      <div class="ambient-blob secondary" style="bottom: -10%; left: -10%; opacity: 0.08;"></div>

      <app-navbar></app-navbar>

      <!-- Main Content -->
      <main class="container-lg py-5 fade-in flex-grow-1 position-relative z-1">
        
        <!-- Welcome Section -->
        <div class="mb-5 d-flex justify-content-between align-items-end">
            <div>
                <h1 class="display-6 fw-bold text-foreground mb-2" [innerHTML]="'DASHBOARD.GREETING' | translate:{name: authService.currentUser()?.displayName || authService.currentUser()?.username}"></h1>
                <p class="text-text-soft mb-0 opacity-80">{{ 'DASHBOARD.SUBTITLE' | translate }}</p>
            </div>
        </div>

        <!-- Dashboard Stats Row -->
        <div class="row g-4 mb-5" *ngIf="!isLoading()">
            <!-- Total Messages -->
            <div class="col-12 col-md-4">
                <div class="card glassmorphism h-100 border-border-soft hover-translate-up transition-all rounded-5">
                    <div class="card-body d-flex align-items-center gap-4 p-4 p-lg-5">
                        <div class="bg-primary-glow p-3 rounded-4 text-white shadow-primary-glow">
                            <lucide-icon [name]="icons.MessageSquare" [size]="28"></lucide-icon>
                        </div>
                        <div>
                            <p class="text-text-whisper mb-0 small text-uppercase fw-bold ls-1">{{ 'DASHBOARD.STATS_CONVERSATIONS' | translate }}</p>
                            <h3 class="fw-bold text-foreground mb-0 fs-2" style="text-shadow: 0 0 20px hsl(var(--primary) / 0.3);">{{ messages().length }}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Public vs Private -->
            <div class="col-12 col-md-4">
                <div class="card glassmorphism h-100 border-border-soft hover-translate-up transition-all rounded-5" style="animation-delay: 0.1s;">
                    <div class="card-body d-flex align-items-center gap-4 p-4 p-lg-5">
                        <div class="bg-info-glow p-3 rounded-4 text-white shadow-info-glow">
                            <lucide-icon [name]="icons.Globe" [size]="28"></lucide-icon>
                        </div>
                        <div>
                            <p class="text-text-whisper mb-0 small text-uppercase fw-bold ls-1">{{ 'DASHBOARD.STATS_SHARING' | translate }}</p>
                            <div class="d-flex gap-3 text-foreground fw-bold mb-0">
                                <span>{{ stats().privateCount }} {{ 'DASHBOARD.STATS_PRIVATE' | translate }}</span>
                                <span class="text-text-soft opacity-30">|</span>
                                <span>{{ stats().publicCount }} {{ 'DASHBOARD.STATS_PUBLIC' | translate }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Vibe Check -->
            <div class="col-12 col-md-4">
                <div class="card glassmorphism h-100 border-border-soft hover-translate-up transition-all rounded-5" style="animation-delay: 0.2s;">
                    <div class="card-body d-flex align-items-center gap-4 p-4 p-lg-5">
                        <div class="p-3 rounded-4 text-white" [ngClass]="stats().avgSentiment < 0 ? 'bg-danger-glow shadow-danger-glow' : 'bg-success-glow shadow-success-glow'">
                            <lucide-icon [name]="icons.Heart" [size]="28"></lucide-icon>
                        </div>
                        <div>
                            <p class="text-text-whisper mb-0 small text-uppercase fw-bold ls-1">{{ 'DASHBOARD.STATS_TONE' | translate }}</p>
                            <h3 class="fw-bold text-foreground mb-0 fs-4">
                                {{ (stats().avgSentiment > 0 ? 'DASHBOARD.TONE_FRIENDLY' : (stats().avgSentiment < 0 ? 'DASHBOARD.TONE_MIXED' : 'DASHBOARD.TONE_NEUTRAL')) | translate }}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div *ngIf="isLoading()" class="text-center py-5">
            <span class="spinner-border spinner-border-sm text-primary"></span>
        </div>

        <!-- Profile Share Card -->
        <div *ngIf="!isLoading()" class="card glass-card-premium mb-5 fade-in shadow-primary-glow">
            <div class="card-body p-4 p-md-5 d-flex flex-column flex-md-row justify-content-between align-items-center gap-4 position-relative z-1">
                <div>
                    <h2 class="h3 fw-bold text-foreground mb-2">{{ 'DASHBOARD.INVITE_TITLE' | translate }}</h2>
                    <p class="text-text-soft mb-0 opacity-90 fs-5">{{ 'DASHBOARD.INVITE_SUBTITLE' | translate }}</p>
                </div>
                
                <div class="d-flex align-items-center gap-2">
                    <button (click)="copyLink()" class="btn btn-hero btn-lg px-5 d-flex align-items-center gap-3 shadow-primary-glow transition-all rounded-pill py-3 fw-bold">
                        <lucide-icon [name]="icons.Copy" [size]="20"></lucide-icon>
                        {{ (copied() ? 'DASHBOARD.COPIED' : 'DASHBOARD.COPY_LINK') | translate }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Messages List -->
        <div class="d-flex align-items-center justify-content-between mb-4">
            <h3 class="h5 fw-bold text-foreground mb-0">{{ 'DASHBOARD.LATEST_STORIES' | translate }}</h3>
            <span class="badge bg-primary-subtle text-primary rounded-pill px-4 py-2 small fw-bold shadow-sm border border-primary-subtle">{{ 'DASHBOARD.NOTES_COUNT' | translate:{count: messages().length} }}</span>
        </div>

        <!-- Rich Empty State -->
        <div *ngIf="!isLoading() && messages().length === 0" class="card glassmorphism border-border-soft p-5 text-center fade-in overflow-hidden rounded-5">
            <div class="py-5">
                <div class="mb-5 d-inline-flex p-4 rounded-circle bg-primary-subtle text-primary border border-primary-subtle animate-breathe animate-glow-pulse" style="width: 140px; height: 140px; align-items: center; justify-content: center;">
                    <lucide-icon [name]="icons.Heart" [size]="64" class="filter-primary-glow"></lucide-icon>
                </div>
                <h3 class="display-6 fw-bold text-foreground mb-3">{{ 'DASHBOARD.EMPTY_TITLE' | translate }}</h3>
                <p class="text-text-soft mb-5 mx-auto lead fs-6 opacity-90" style="max-width: 480px;">
                    {{ 'DASHBOARD.EMPTY_SUBTITLE' | translate }}
                </p>
                <div class="d-flex justify-content-center">
                    <button (click)="copyLink()" class="btn btn-hero btn-lg px-5 py-3 d-inline-flex align-items-center justify-content-center gap-3 shadow-primary-glow rounded-pill fw-bold fs-5">
                        <lucide-icon [name]="icons.Copy" [size]="24"></lucide-icon>
                        {{ (copied() ? 'DASHBOARD.LINK_READY' : 'DASHBOARD.GET_LINK') | translate }}
                    </button>
                </div>
            </div>
        </div>

        <div *ngIf="!isLoading() && messages().length > 0" class="d-flex flex-column gap-3">
            <div *ngFor="let msg of messages(); let i = index" class="card message-card border-border-soft cursor-pointer glass-hover transition-all fade-in overflow-hidden rounded-4" 
                 [routerLink]="['/message', msg.id]" [style.animation-delay]="(i * 0.05) + 's'">
                <div class="card-body d-flex justify-content-between align-items-center p-4">
                    <div class="text-truncate pe-4">
                        <div class="d-flex align-items-center gap-3 mb-2">
                            <span class="badge rounded-pill px-3 py-1 fw-bold" [ngClass]="msg.isPublic ? 'bg-info-glow text-white' : 'bg-secondary text-white'" style="font-size: 10px; letter-spacing: 0.5px;">
                                {{ (msg.isPublic ? 'DASHBOARD.PUBLIC_NOTE' : 'DASHBOARD.PRIVATE_NOTE') | translate }}
                            </span>
                            <small class="text-text-whisper d-flex align-items-center gap-1 opacity-75">
                                <lucide-icon [name]="icons.Ghost" [size]="12"></lucide-icon>
                                {{ msg.sentAt | date:'medium' }}
                            </small>
                        </div>
                        <p class="mb-0 text-foreground fw-medium text-truncate fs-5">{{ msg.content }}</p>
                    </div>
                    <div class="bg-background-soft p-2 rounded-3">
                        <lucide-icon [name]="icons.ChevronRight" class="text-text-soft" [size]="24"></lucide-icon>
                    </div>
                </div>
            </div>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `,
    styles: [`
    .ls-1 { letter-spacing: 1px; }
    .bg-primary-glow { background: hsl(var(--primary)); box-shadow: 0 8px 25px -5px hsl(var(--primary) / 0.4); }
    .bg-info-glow { background: #38bdf8; box-shadow: 0 8px 25px -5px rgba(56, 189, 248, 0.4); }
    .bg-success-glow { background: #10b981; box-shadow: 0 8px 25px -5px rgba(16, 185, 129, 0.4); }
    .bg-danger-glow { background: hsl(var(--destructive)); box-shadow: 0 8px 25px -5px hsl(var(--destructive) / 0.4); }

    .hover-translate-up {
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        &:hover { transform: translateY(-8px); }
    }

    .bg-primary-subtle { background-color: hsl(var(--primary) / 0.08) !important; color: hsl(var(--primary)); }
    .bg-background-soft { background-color: rgba(255, 255, 255, 0.03); }
    .border-border-soft { border-color: hsl(var(--border) / 0.4) !important; }
  `]
})
export class DashboardComponent implements OnInit {
    private authServiceRef = inject(AuthService);
    private api = inject(BluntboxApiService);
    private router = inject(Router);

    readonly icons = {
        MessageSquare, LogOut, ChevronRight, Copy, Eye,
        BarChart3, Lock, Globe, Ghost, Heart, Info, Github, Settings, HelpCircle, Shield
    };

    readonly currentYear = new Date().getFullYear();

    messages = signal<MessageDto[]>([]);
    isLoading = signal<boolean>(true);
    copied = signal<boolean>(false);

    // Stats computed signal
    stats = computed(() => {
        const data = this.messages();
        const publicCount = data.filter(m => m.isPublic).length;
        const privateCount = data.length - publicCount;

        let totalSentiment = 0;
        let scoredCount = 0;
        data.forEach(m => {
            if (m.sentimentScore !== null && m.sentimentScore !== undefined) {
                totalSentiment += m.sentimentScore;
                scoredCount++;
            }
        });

        const avgSentiment = scoredCount > 0 ? (totalSentiment / scoredCount) : 0;

        return { publicCount, privateCount, avgSentiment };
    });

    // Expose authService to template
    public authService = this.authServiceRef;

    ngOnInit() {
        console.log('Dashboard Init. Current User:', this.authServiceRef.currentUser());
        this.api.getReceivedMessages().subscribe({
            next: (msgs) => {
                this.messages.set(msgs.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()));
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }

    logout() {
        this.authServiceRef.logout();
        this.router.navigate(['/auth']);
    }

    copyLink() {
        const user = this.authServiceRef.currentUser();
        console.log('Copy Link clicked. User:', user);

        if (!user?.username) {
            console.error('No username found to copy. User object:', user);
            return;
        }

        const url = `${window.location.origin}/user/${user.username}`;
        console.log('Copying URL:', url);
        navigator.clipboard.writeText(url).then(() => {
            this.copied.set(true);
            setTimeout(() => this.copied.set(false), 2000);
        }).catch(err => console.error('Writing to clipboard failed:', err));
    }
}
