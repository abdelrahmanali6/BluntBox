import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ArrowLeft, Settings, Lock, LogOut, User } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule, FooterComponent, NavbarComponent, TranslateModule],
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
                    <h1 class="display-6 fw-bold text-foreground mb-2" [innerHTML]="'SETTINGS.TITLE' | translate"></h1>
                    <p class="text-text-soft mb-0 opacity-80">{{ 'SETTINGS.SUBTITLE' | translate }}</p>
                </div>

                <!-- Account Info -->
                <div class="card glassmorphism border-border-soft mb-5 shadow-lg">
                    <div class="card-body p-4 p-md-5">
                         <div class="d-flex align-items-center gap-3 mb-5">
                            <div class="bg-primary-glow p-2 rounded-3 text-white">
                                <lucide-icon [name]="icons.User" [size]="20"></lucide-icon>
                            </div>
                            <h2 class="h5 fw-bold text-foreground mb-0">{{ 'SETTINGS.PROFILE_OVERVIEW' | translate }}</h2>
                         </div>

                         <div class="mb-4">
                            <label class="form-label text-text-whisper small fw-bold text-uppercase ls-1">{{ 'SETTINGS.USERNAME' | translate }}</label>
                            <input type="text" class="form-control notebook-input border-border-soft p-3 bg-white-opacity-5" [value]="authService.currentUser()?.username" disabled readonly>
                         </div>
                         <div class="mb-4">
                            <label class="form-label text-text-whisper small fw-bold text-uppercase ls-1">{{ 'SETTINGS.DISPLAY_NAME' | translate }}</label>
                            <input type="text" class="form-control notebook-input border-border-soft p-3 bg-white-opacity-5" [value]="authService.currentUser()?.displayName || ('SETTINGS.NOT_SET' | translate)" disabled readonly>
                         </div>
                         <div class="mb-0">
                            <label class="form-label text-text-whisper small fw-bold text-uppercase ls-1">{{ 'SETTINGS.EMAIL' | translate }}</label>
                            <input type="email" class="form-control notebook-input border-border-soft p-3 bg-white-opacity-5" [value]="authService.currentUser()?.email || ('SETTINGS.NOT_AVAILABLE' | translate)" disabled readonly>
                         </div>
                    </div>
                </div>

                <!-- Danger Zone / Actions -->
                <div class="border-top border-border-soft pt-5">
                    <h3 class="h6 text-text-whisper mb-4 text-uppercase ls-1 fw-bold">{{ 'SETTINGS.SESSION_MGMT' | translate }}</h3>
                    <button (click)="logout()" class="btn btn-hero w-100 py-3 d-flex align-items-center justify-content-center gap-2 fw-bold text-danger bg-danger-subtle border-danger border-opacity-10 shadow-sm glass-hover">
                        <lucide-icon [name]="icons.LogOut" [size]="20"></lucide-icon>
                        {{ 'SETTINGS.LOGOUT_BTN' | translate }}
                    </button>
                    <p class="text-center text-text-whisper extra-small mt-3 opacity-60">{{ 'SETTINGS.LOGOUT_DESC' | translate }}</p>
                </div>

            </div>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .ls-1 { letter-spacing: 1px; }
    .bg-primary-glow { background: hsl(var(--primary)); box-shadow: 0 0 15px hsl(var(--primary) / 0.4); }
    .bg-danger-subtle { background-color: rgba(239, 68, 68, 0.05) !important; color: rgb(239, 68, 68); }
    .bg-white-opacity-5 { background-color: rgba(255, 255, 255, 0.03) !important; color: hsl(var(--text-soft)) !important; }
    .border-border-soft { border-color: hsl(var(--border) / 0.4) !important; }
    .extra-small { font-size: 0.75rem; }
  `]
})
export class SettingsComponent {
  private authServiceRef = inject(AuthService);
  private router = inject(Router);

  readonly icons = { ArrowLeft, Settings, Lock, LogOut, User };

  // Expose authService to template
  public authService = this.authServiceRef;

  logout() {
    this.authServiceRef.logout();
    this.router.navigate(['/auth']);
  }
}
