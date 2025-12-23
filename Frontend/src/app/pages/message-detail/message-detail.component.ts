import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LucideAngularModule, MessageSquare, ArrowLeft, Send, Lock, Globe, Clock } from 'lucide-angular';
import { BluntboxApiService } from '../../core/services/bluntbox-api.service';
import { AuthService } from '../../core/services/auth.service';
import { MessageWithReplies, ModerationStatus } from '../../core/models/api.models';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
    selector: 'app-message-detail',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule, FooterComponent, TranslateModule],
    template: `
    <div class="min-vh-100 bg-background d-flex flex-column position-relative overflow-hidden">
        <!-- Global background elements -->
        <div class="position-absolute top-0 start-0 w-100 h-100 bg-dot-pattern pointer-events-none" style="z-index: 0;"></div>
        <div class="ambient-blob primary" style="top: -100px; left: -100px; opacity: 0.1;"></div>
        <div class="ambient-blob secondary" style="bottom: -100px; right: -100px; opacity: 0.1;"></div>

        <nav class="border-bottom border-border-soft py-3 px-4 glassmorphism z-2">
            <div class="container-lg px-0">
                 <a [routerLink]="backLink()" class="d-flex align-items-center gap-2 text-decoration-none text-text-soft hover-text-foreground transition-all" style="width: fit-content;">
                    <lucide-icon [name]="icons.ArrowLeft" [size]="20"></lucide-icon>
                    <span class="fw-medium">{{ backLabel() | translate }}</span>
                 </a>
            </div>
        </nav>

        <main class="container-lg py-5 flex-grow-1 position-relative z-1" *ngIf="data()">
            <div class="row justify-content-center">
                <div class="col-12 col-md-8">
                    
                    <!-- Original Message -->
                    <div class="card glassmorphism border-border-soft mb-4 fade-in overflow-hidden">
                        <div class="card-body p-4 p-md-5">
                            <div class="d-flex align-items-center gap-2 mb-4">
                                <span class="badge bg-primary-subtle text-primary rounded-pill px-3 py-1">
                                    <lucide-icon [name]="icons.MessageSquare" [size]="12" class="me-1"></lucide-icon>
                                    {{ 'MESSAGE_DETAIL.ORIGINAL_MESSAGE' | translate }}
                                </span>
                                <small class="text-text-whisper">{{ data()!.message.sentAt | date:'medium' }}</small>
                            </div>
                            <p class="display-6 fs-4 text-foreground mb-4 leading-relaxed">{{ data()!.message.content }}</p>
                            
                            <div class="mt-4 pt-4 border-top border-border-soft d-flex flex-wrap gap-4 text-text-whisper small">
                                <span class="d-flex align-items-center gap-2">
                                    <div class="bg-success rounded-circle" style="width: 8px; height: 8px;"></div>
                                    {{ 'MESSAGE_DETAIL.STATUS' | translate }}: {{ getStatusLabel(data()!.message.moderationStatus) }}
                                </span>
                                <span class="d-flex align-items-center gap-2">
                                    <lucide-icon [name]="data()!.message.isPublic ? icons.Globe : icons.Lock" [size]="14"></lucide-icon>
                                    {{ (data()!.message.isPublic ? 'MESSAGE_DETAIL.PUBLICLY_VISIBLE' : 'MESSAGE_DETAIL.PRIVATE_TO_YOU') | translate }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Reply Section -->
                    <div class="card glassmorphism border-border-soft mb-5 fade-in shadow-primary-glow overflow-hidden" style="animation-delay: 0.1s;">
                        <div class="card-body p-4 p-md-5">
                            <div class="d-flex align-items-center gap-2 mb-4">
                                <div class="bg-primary-glow p-2 rounded-3 text-white">
                                    <lucide-icon [name]="icons.Send" [size]="18"></lucide-icon>
                                </div>
                                <h3 class="h5 text-foreground fw-bold mb-0">{{ 'MESSAGE_DETAIL.POST_REPLY' | translate }}</h3>
                            </div>
                            
                            <form (ngSubmit)="sendReply()">
                                <textarea 
                                    [(ngModel)]="replyContent" 
                                    name="replyContent" 
                                    rows="3" 
                                    class="form-control notebook-input border-border-soft mb-4 p-3 fs-5" 
                                    [placeholder]="'MESSAGE_DETAIL.REPLY_PLACEHOLDER' | translate"
                                    [disabled]="isSending"
                                ></textarea>
                                
                                <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-4">
                                    <div class="form-check form-switch cursor-pointer">
                                        <input class="form-check-input" type="checkbox" id="replyPublic" [(ngModel)]="replyPublic" name="replyPublic">
                                        <label class="form-check-label text-text-soft small d-flex align-items-center gap-2" for="replyPublic">
                                            <lucide-icon [name]="replyPublic ? icons.Globe : icons.Lock" [size]="14"></lucide-icon>
                                            {{ (replyPublic ? 'MESSAGE_DETAIL.VISIBLE_PUBLIC_FEED' : 'MESSAGE_DETAIL.KEEP_REPLY_PRIVATE') | translate }}
                                        </label>
                                    </div>

                                    <button type="submit" class="btn btn-hero btn-lg px-5 shadow-primary-glow transition-all py-3 rounded-pill fw-bold d-flex align-items-center gap-3" [disabled]="isSending || !replyContent.trim()">
                                        {{ (isSending ? 'MESSAGE_DETAIL.SENDING' : 'MESSAGE_DETAIL.SEND_REPLY') | translate }}
                                        <lucide-icon [name]="icons.Send" [size]="20"></lucide-icon>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <!-- Replies List -->
                    <div class="d-flex align-items-center justify-content-between mb-4 px-2">
                        <h3 class="h6 text-text-soft fw-bold mb-0 text-uppercase ls-1">{{ 'MESSAGE_DETAIL.THREAD_HISTORY' | translate }}</h3>
                        <span class="badge bg-primary-subtle text-primary rounded-pill px-3">{{ data()!.replies.length }}</span>
                    </div>

                    <div class="d-flex flex-column gap-3">
                        <div *ngIf="data()!.replies.length === 0" class="card glassmorphism border-border-soft p-5 text-center fade-in border-dashed">
                             <p class="text-text-whisper mb-0 opacity-80">{{ 'MESSAGE_DETAIL.NO_REPLIES' | translate }}</p>
                        </div>

                        <div *ngFor="let reply of data()!.replies; let i = index" class="card glassmorphism border-border-soft fade-in hover-translate-up transition-all" [style.animation-delay]="(0.2 + (i * 0.05)) + 's'">
                            <div class="card-body p-4">
                                <p class="text-foreground fs-5 mb-3">{{ reply.content }}</p>
                                <div class="text-text-whisper small d-flex align-items-center gap-1">
                                    <lucide-icon [name]="icons.Clock" [size]="12"></lucide-icon>
                                    {{ 'MESSAGE_DETAIL.REPLIED' | translate }} {{ reply.createdAt | date:'short' }}
                                </div>
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
    .ls-1 { letter-spacing: 1px; }
    .bg-primary-glow { background: hsl(var(--primary)); box-shadow: 0 0 15px hsl(var(--primary) / 0.5); }
    .bg-primary-subtle { background-color: hsl(var(--primary) / 0.1) !important; color: hsl(var(--primary)); }
    .border-border-soft { border-color: hsl(var(--border) / 0.4) !important; }
    .hover-translate-up {
        transition: transform 0.3s ease;
        &:hover { transform: translateY(-5px); }
    }
  `]
})
export class MessageDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private api = inject(BluntboxApiService);
    private authService = inject(AuthService);
    private translate = inject(TranslateService);

    readonly icons = { ArrowLeft, MessageSquare, Send, Lock, Globe, Clock };

    data = signal<MessageWithReplies | null>(null);
    backLink = signal<any[]>(['/dashboard']);
    backLabel = signal<string>('MESSAGE_DETAIL.BACK_TO_INBOX');

    replyContent = '';
    replyPublic = true;
    isSending = false;

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.loadThread(id);
        }

        // Handle dynamic back link
        this.route.queryParamMap.subscribe(params => {
            const from = params.get('from');
            const user = params.get('user');

            if (from === 'public' && user) {
                this.backLink.set(['/user', user]);
                this.backLabel.set('MESSAGE_DETAIL.BACK_TO_PUBLIC_PAGE');
            } else if (from === 'notifications') {
                this.backLink.set(['/notifications']);
                this.backLabel.set('MESSAGE_DETAIL.BACK_TO_NOTIFICATIONS');
            } else {
                this.backLink.set(['/dashboard']);
                this.backLabel.set('MESSAGE_DETAIL.BACK_TO_INBOX');
            }
        });
    }

    loadThread(id: string) {
        this.api.getMessageWithReplies(id).subscribe(res => {
            console.log('Thread Response:', res);
            this.data.set(res);
        });
    }

    sendReply() {
        const currentCheck = this.data();
        const currentUser = this.authService.currentUser();

        if (!currentCheck || !this.replyContent.trim()) return;

        // Prepare payload
        const payload = {
            content: this.replyContent,
            isPublic: this.replyPublic,
            recipientUserId: currentCheck.message.recipientUserId
        };

        this.isSending = true;
        this.api.replyToMessage(currentCheck.message.id, payload).subscribe({
            next: () => {
                this.isSending = false;

                // Optimistic Update
                const newReply = {
                    id: 'temp-' + Date.now(),
                    messageId: currentCheck.message.id,
                    replierUserId: currentUser?.id || 'unknown',
                    content: this.replyContent,
                    isPublic: this.replyPublic,
                    createdAt: new Date().toISOString()
                };

                // Update signal immutable
                this.data.update(d => {
                    if (!d) return null;
                    return {
                        ...d,
                        replies: [...d.replies, newReply]
                    };
                });

                this.replyContent = '';

                // Optional: Reload in background to check (might overwrite if pending)
                // this.loadThread(currentCheck.message.id); 
            },
            error: () => this.isSending = false
        });
    }

    getStatusLabel(status: number): string {
        return ModerationStatus[status];
    }
}
