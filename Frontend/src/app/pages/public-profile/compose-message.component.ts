import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Send, Lock, Globe, CheckCircle, ShieldAlert, Clock, AlertTriangle, MessageSquare, ChevronDown } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from '../../core/services/message.service';
import { LanguageService } from '../../core/services/language.service';
import { ModerationStatus } from '../../core/models/api.models';

type FormState = 'composing' | 'success' | 'pending' | 'blocked' | 'error';

@Component({
    selector: 'app-compose-message',
    standalone: true,
    imports: [CommonModule, FormsModule, LucideAngularModule, TranslateModule],
    styles: [`
    textarea { resize: none; border: 1px solid hsl(var(--border)); }
    textarea:focus { border-color: hsl(var(--primary) / 0.5); }
    .feedback-icon { animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    @keyframes scaleIn {
        0% { transform: scale(0); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }
  `],
    template: `
    <div class="card glassmorphism border-border-soft mb-5 fade-in shadow-sm overflow-hidden">
        <div class="card-body p-4 p-md-5">
            
            <!-- Composing State -->
            <div *ngIf="formState() === 'composing'">
                <div class="d-flex align-items-center gap-2 mb-4">
                    <div class="bg-primary-glow p-2 rounded-3 text-white">
                        <lucide-icon [name]="icons.Send" [size]="18"></lucide-icon>
                    </div>
                    <h3 class="h5 text-foreground fw-bold mb-0">{{ 'COMPOSE.TITLE' | translate }}</h3>
                </div>
                
                <form (ngSubmit)="sendMessage()">
                    <textarea 
                        [(ngModel)]="content" 
                        name="content" 
                        rows="4" 
                        class="form-control notebook-input border-border-soft mb-4 p-3 fs-5" 
                        [placeholder]="'COMPOSE.PLACEHOLDER' | translate"
                        [disabled]="isSending()"
                        required>
                    </textarea>

                    <div class="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-4">
                        <div class="form-check form-switch cursor-pointer">
                            <input class="form-check-input" type="checkbox" role="switch" id="publicSwitch" [(ngModel)]="isPublic" name="isPublic">
                            <label class="form-check-label text-text-soft small d-flex align-items-center gap-2" for="publicSwitch">
                                <lucide-icon [name]="isPublic ? icons.Globe : icons.Lock" [size]="14"></lucide-icon>
                                {{ (isPublic ? 'COMPOSE.IS_PUBLIC' : 'COMPOSE.IS_PRIVATE') | translate }}
                            </label>
                        </div>

                        <button type="submit" class="btn btn-hero btn-lg d-flex align-items-center gap-3 px-5 shadow-primary-glow py-3 rounded-pill fw-bold" [disabled]="isSending() || !content.trim()">
                            <span *ngIf="isSending()" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            {{ (isSending() ? 'COMPOSE.SENDING' : 'COMPOSE.SEND_NOTE') | translate }}
                            <lucide-icon *ngIf="!isSending()" [name]="icons.Send" [size]="20"></lucide-icon>
                        </button>
                    </div>
                </form>
            </div>

            <!-- Success / Moderated States -->
            <div *ngIf="formState() !== 'composing'" class="text-center py-5 feedback-view">
                <!-- Icon mapping -->
                <div class="mb-4 d-inline-flex p-4 rounded-5 feedback-icon border border-white border-opacity-10 shadow-lg" [ngClass]="getFeedbackStyles().iconBg">
                    <lucide-icon [name]="getFeedbackStyles().icon" [size]="56" [class]="getFeedbackStyles().iconColor"></lucide-icon>
                </div>
                
                <h3 class="h3 fw-bold text-foreground mb-3">{{ getFeedbackStyles().title | translate }}</h3>
                <p class="text-text-soft mb-5 mx-auto lead fs-6" style="max-width: 420px; opacity: 0.8;">
                    {{ getFeedbackStyles().message | translate }}
                </p>

                <button (click)="resetForm()" class="btn btn-hero btn-lg d-inline-flex align-items-center gap-3 text-foreground px-5 glass-hover">
                    <lucide-icon [name]="icons.MessageSquare" [size]="20"></lucide-icon>
                    {{ 'COMPOSE.SEND_ANOTHER' | translate }}
                </button>
            </div>

        </div>
    </div>
  `
})
export class ComposeMessageComponent {
    @Input({ required: true }) recipientUserId!: string;
    @Output() messageSent = new EventEmitter<void>();

    private messageService = inject(MessageService);
    private langService = inject(LanguageService);

    readonly icons = { Send, Lock, Globe, CheckCircle, ShieldAlert, Clock, AlertTriangle, MessageSquare, ChevronDown };

    content = '';
    isPublic = false;
    selectedLanguage: string = this.langService.currentLang();

    // State management
    formState = signal<FormState>('composing');
    isSending = signal<boolean>(false);

    getFeedbackStyles() {
        const state = this.formState();
        switch (state) {
            case 'success':
                return {
                    icon: this.icons.CheckCircle,
                    iconBg: 'bg-primary-subtle',
                    iconColor: 'text-primary',
                    title: 'COMPOSE.SUCCESS_TITLE',
                    message: 'COMPOSE.SUCCESS_BODY'
                };
            case 'pending':
                return {
                    icon: this.icons.Clock,
                    iconBg: 'bg-warning-subtle',
                    iconColor: 'text-warning',
                    title: 'COMPOSE.PENDING_TITLE',
                    message: 'COMPOSE.PENDING_BODY'
                };
            case 'blocked':
                return {
                    icon: this.icons.ShieldAlert,
                    iconBg: 'bg-danger-subtle',
                    iconColor: 'text-danger',
                    title: 'COMPOSE.BLOCKED_TITLE',
                    message: 'COMPOSE.BLOCKED_BODY'
                };
            case 'error':
            default:
                return {
                    icon: this.icons.AlertTriangle,
                    iconBg: 'bg-danger-subtle',
                    iconColor: 'text-danger',
                    title: 'COMPOSE.ERROR_TITLE',
                    message: 'COMPOSE.ERROR_BODY'
                };
        }
    }

    sendMessage() {
        if (!this.content.trim()) return;

        this.isSending.set(true);

        this.messageService.sendMessage({
            recipientUserId: this.recipientUserId,
            content: this.content,
            isPublic: this.isPublic,
            language: this.selectedLanguage
        }).subscribe({
            next: (msg) => {
                this.isSending.set(false);
                this.content = ''; // Clear form

                if (msg.moderationStatus === ModerationStatus.Blocked) {
                    this.formState.set('blocked');
                } else if (msg.moderationStatus === ModerationStatus.Pending) {
                    this.formState.set('pending');
                } else {
                    this.formState.set('success');
                    this.messageSent.emit();
                }
            },
            error: () => {
                this.isSending.set(false);
                this.formState.set('error');
            }
        });
    }

    resetForm() {
        this.formState.set('composing');
        this.content = '';
        this.selectedLanguage = this.langService.currentLang();
    }

    setLanguage(lang: string) {
        this.selectedLanguage = lang;
    }
}
