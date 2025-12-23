import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Lock, ArrowLeft, Loader2 } from 'lucide-angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BluntboxApiService } from '../../core/services/bluntbox-api.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, NavbarComponent, FooterComponent, TranslateModule],
  template: `
    <div class="min-vh-100 bg-background d-flex flex-column position-relative overflow-hidden">
        <!-- Global background elements -->
        <div class="position-absolute top-0 start-0 w-100 h-100 bg-dot-pattern pointer-events-none" style="z-index: 0;"></div>
        <div class="ambient-blob primary" style="top: -100px; left: -100px; opacity: 0.1;"></div>
        <div class="ambient-blob secondary" style="bottom: -100px; right: -100px; opacity: 0.1;"></div>

      <app-navbar></app-navbar>

      <main class="container-lg py-5 fade-in flex-grow-1 position-relative z-1">
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6">
                
                <div class="mb-5 text-center text-md-start">
                    <h1 class="display-6 fw-bold text-foreground mb-2" [innerHTML]="'CHANGE_PASSWORD.TITLE' | translate"></h1>
                    <p class="text-text-soft mb-0 opacity-80">{{ 'CHANGE_PASSWORD.SUBTITLE' | translate }}</p>
                </div>

                <div class="card glassmorphism border-border-soft shadow-lg overflow-hidden">
                    <div class="card-body p-4 p-md-5">
                         
                         <form (ngSubmit)="onSubmit()">
                             <div class="mb-4">
                                <label class="form-label text-text-whisper small fw-bold text-uppercase ls-1">{{ 'CHANGE_PASSWORD.CURRENT_PASS' | translate }}</label>
                                <input type="password" [(ngModel)]="currentPassword" name="currentPassword" required 
                                    class="form-control notebook-input border-border-soft p-3 bg-white-opacity-5" 
                                    [placeholder]="'CHANGE_PASSWORD.CURRENT_PLACEHOLDER' | translate"
                                    [disabled]="isSubmitting()">
                             </div>
                             <div class="mb-4">
                                <label class="form-label text-text-whisper small fw-bold text-uppercase ls-1">{{ 'CHANGE_PASSWORD.NEW_PASS' | translate }}</label>
                                <input type="password" [(ngModel)]="newPassword" name="newPassword" required minlength="8"
                                    class="form-control notebook-input border-border-soft p-3 bg-white-opacity-5" 
                                    [placeholder]="'CHANGE_PASSWORD.NEW_PLACEHOLDER' | translate"
                                    [disabled]="isSubmitting()">
                             </div>
                             <div class="mb-5">
                                <label class="form-label text-text-whisper small fw-bold text-uppercase ls-1">{{ 'CHANGE_PASSWORD.CONFIRM_PASS' | translate }}</label>
                                <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" required
                                    class="form-control notebook-input border-border-soft p-3 bg-white-opacity-5" 
                                    [placeholder]="'CHANGE_PASSWORD.CONFIRM_PLACEHOLDER' | translate"
                                    [disabled]="isSubmitting()">
                             </div>

                             <!-- Error Alert -->
                             <div *ngIf="errorMessage()" class="alert alert-danger d-flex align-items-center mb-4 fade-in">
                                <lucide-icon [name]="icons.Lock" [size]="18" class="me-2"></lucide-icon>
                                <div>{{ errorMessage() }}</div>
                             </div>

                             <!-- Success Alert -->
                             <div *ngIf="successMessage()" class="alert alert-success d-flex align-items-center mb-4 fade-in">
                                <lucide-icon [name]="icons.Lock" [size]="18" class="me-2"></lucide-icon>
                                <div>{{ successMessage() }}</div>
                             </div>



                             <button type="submit" [disabled]="isSubmitting() || !isValid()" 
                                class="btn btn-hero btn-lg w-100 py-3 shadow-primary-glow transition-all fw-bold d-flex align-items-center justify-content-center gap-2">
                                <lucide-icon *ngIf="isSubmitting()" [name]="icons.Loader2" [size]="20" class="spin"></lucide-icon>
                                {{ (isSubmitting() ? 'CHANGE_PASSWORD.UPDATING' : 'CHANGE_PASSWORD.UPDATE_BTN') | translate }}
                             </button>
                         </form>
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
    .bg-primary-subtle { background-color: hsl(var(--primary) / 0.05) !important; color: hsl(var(--primary)); }
    .bg-white-opacity-5 { background-color: rgba(255, 255, 255, 0.03) !important; color: hsl(var(--text-soft)) !important; }
    .border-border-soft { border-color: hsl(var(--border) / 0.4) !important; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  `]
})
export class ChangePasswordComponent {
  private translate = inject(TranslateService);
  private api = inject(BluntboxApiService);
  readonly icons = { Lock, ArrowLeft, Loader2 };

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  isSubmitting = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  isValid(): boolean {
    return !!(
      this.currentPassword &&
      this.newPassword &&
      this.newPassword.length >= 8 &&
      this.confirmPassword &&
      this.newPassword === this.confirmPassword
    );
  }

  onSubmit() {
    if (!this.isValid()) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload = {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    };

    this.api.changePassword(payload).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.successMessage.set(res.message || this.translate.instant('CHANGE_PASSWORD.SUCCESS_ALERT_REAL'));
        // Reset form
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.body?.error || this.translate.instant('CHANGE_PASSWORD.ERROR_GENERIC'));
      }
    });
  }
}
