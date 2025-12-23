import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule, Share2, MessageSquare } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { UserPublic, MessageDto, ModerationStatus } from '../../core/models/api.models';
import { BluntboxApiService } from '../../core/services/bluntbox-api.service';
import { AuthService } from '../../core/services/auth.service';
import { ComposeMessageComponent } from './compose-message.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
    selector: 'app-public-profile',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, ComposeMessageComponent, RouterLink, FooterComponent, NavbarComponent, TranslateModule],
    template: `
    <div class="min-vh-100 bg-background d-flex flex-column position-relative overflow-hidden">
        <!-- Global background elements -->
        <div class="position-absolute top-0 start-0 w-100 h-100 bg-dot-pattern pointer-events-none" style="z-index: 0;"></div>
        <div class="ambient-blob primary" style="top: -100px; left: -100px; opacity: 0.1;"></div>
        <div class="ambient-blob secondary" style="bottom: -100px; right: -100px; opacity: 0.1;"></div>

        <!-- Header / Nav -->
        <app-navbar></app-navbar>

        <main class="container-lg py-5 flex-grow-1 position-relative z-1">
            <div class="row justify-content-center">
                <div class="col-12 col-md-8 col-lg-6">
                    
                    <!-- Profile Header -->
                    <div class="text-center mb-5 fade-in">
                        <h1 class="display-5 fw-bold text-foreground mb-2">
                            <span class="text-gradient-primary">{{ user.displayName || '@' + user.userName }}</span>
                        </h1>
                        <p class="text-text-soft lead fs-6 mb-0 opacity-80">
                            {{ 'PUBLIC_PROFILE.SUBTITLE' | translate }}
                        </p>
                    </div>

                    <!-- Compose Form - Only show if not viewing own profile -->
                    <app-compose-message 
                        *ngIf="!isOwnProfile()" 
                        [recipientUserId]="user.id" 
                        (messageSent)="loadPublicMessages()">
                    </app-compose-message>

                    <!-- Own Profile Message -->
                    <div *ngIf="isOwnProfile()" class="card glassmorphism border-border-soft mb-5 p-4 p-md-5 text-center fade-in">
                        <div class="mb-3 text-primary">
                            <lucide-icon [name]="icons.MessageSquare" [size]="48"></lucide-icon>
                        </div>
                        <h3 class="h5 fw-bold text-foreground mb-2">{{ 'PUBLIC_PROFILE.OWN_PROFILE_TITLE' | translate }}</h3>
                        <p class="text-text-soft mb-0 opacity-80">{{ 'PUBLIC_PROFILE.OWN_PROFILE_DESC' | translate }}</p>
                    </div>

                    <!-- Public Feed -->
                    <div class="d-flex align-items-center justify-content-between mb-4 mt-5">
                        <h2 class="h5 fw-bold text-foreground mb-0">{{ 'PUBLIC_PROFILE.MESSAGES_HEADER' | translate }}</h2>
                        <span class="badge bg-primary-subtle text-primary rounded-pill px-3">{{ messages().length }}</span>
                    </div>

                    <div class="d-flex flex-column gap-3">
                        <div *ngIf="isLoading()" class="text-center py-5">
                            <span class="spinner-border spinner-border-sm text-primary"></span>
                        </div>

                        <div *ngIf="!isLoading() && messages().length === 0" class="card glassmorphism border-border-soft p-5 text-center fade-in rounded-4 border-dashed">
                           <p class="text-text-soft mb-0">{{ 'PUBLIC_PROFILE.EMPTY_FEED' | translate }}</p>
                        </div>

                        <div *ngFor="let msg of messages(); let i = index" class="card glassmorphism border-border-soft fade-in hover-translate-up transition-all overflow-hidden" [style.animation-delay]="(i * 0.05) + 's'">
                            <div class="card-body p-4">
                                <p class="text-foreground fs-5 mb-4" style="white-space: pre-wrap;">{{ msg.content }}</p>
                                <div class="d-flex justify-content-between align-items-center text-text-whisper small mb-4">
                                    <span class="d-flex align-items-center gap-1">
                                        <lucide-icon [name]="icons.MessageSquare" [size]="12"></lucide-icon>
                                        {{ msg.sentAt | date:'mediumDate' }}
                                    </span>
                                    <span *ngIf="msg.sentimentScore !== null" class="badge rounded-pill px-3 py-1" [ngClass]="msg.sentimentScore > 0 ? 'bg-success-subtle text-success' : 'bg-muted text-text-soft'">
                                        Score: {{ msg.sentimentScore | number:'1.1-1' }}
                                    </span>
                                </div>
                                
                                <a [routerLink]="['/message', msg.id]" [queryParams]="{from: 'public', user: user.userName}" class="btn btn-hero btn-sm w-100 d-flex align-items-center justify-content-center gap-2 py-2 glass-hover">
                                    <lucide-icon [name]="icons.MessageSquare" [size]="16"></lucide-icon>
                                    {{ 'PUBLIC_PROFILE.VIEW_THREAD' | translate }}
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
        
        <app-footer></app-footer>
    </div>
  `,
    styles: [`
    .bg-primary-subtle { background-color: hsl(var(--primary) / 0.1) !important; color: hsl(var(--primary)); }
    .bg-success-subtle { background-color: hsl(var(--success) / 0.1) !important; color: hsl(var(--success)); }
    .border-border-soft { border-color: hsl(var(--border) / 0.4) !important; }
    .hover-translate-up {
        transition: transform 0.3s ease;
        &:hover { transform: translateY(-5px); }
    }
  `]
})
export class PublicProfileComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private api = inject(BluntboxApiService);
    private authService = inject(AuthService);

    readonly icons = { MessageSquare };

    user!: UserPublic;
    messages = signal<MessageDto[]>([]);
    isLoading = signal<boolean>(true);

    // Check if viewing own profile
    isOwnProfile = computed(() => {
        const currentUser = this.authService.currentUser();
        return currentUser?.id === this.user?.id;
    });

    ngOnInit() {
        // Subscribe to params to refresh data when navigating between profiles
        this.route.params.subscribe(() => {
            this.user = this.route.snapshot.data['recipient'];
            if (this.user) {
                this.loadPublicMessages();
            }
        });
    }

    loadPublicMessages() {
        this.api.getPublicMessages(this.user.id).subscribe({
            next: (msgs) => {
                // Sort by SentAt Descending
                const sorted = msgs.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
                this.messages.set(sorted);
                this.isLoading.set(false);
            },
            error: () => this.isLoading.set(false)
        });
    }
}
