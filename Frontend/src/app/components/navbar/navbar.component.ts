import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, MessageSquare, LogOut, Settings, User, Lock, ChevronDown, LogIn, Globe } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';
import { AuthService } from '../../core/services/auth.service';

import { NotificationsDropdownComponent } from '../notifications/notifications-dropdown.component';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule, NotificationsDropdownComponent, TranslateModule],
    template: `
    <nav class="border-bottom border-border py-2 px-4 sticky-top navbar-glass" style="z-index: 50;">
        <div class="d-flex justify-content-between align-items-center w-100 position-relative">
            <!-- Left: Logo -->
            <a routerLink="/" class="d-flex align-items-center gap-2 text-decoration-none group">
                <div class="bg-primary-subtle p-2 rounded-circle text-primary transition-transform group-hover-scale">
                    <lucide-icon [name]="icons.MessageSquare" [size]="20"></lucide-icon>
                </div>
                <span class="fw-bold fs-5 text-foreground">BluntBox</span>
            </a>

            <!-- Center: Nav Links (Logged In Only) -->
            <div *ngIf="authService.currentUser()" class="d-none d-md-flex align-items-center gap-4 position-absolute start-50 translate-middle-x">
                <a routerLink="/dashboard" routerLinkActive="text-foreground fw-bold" [routerLinkActiveOptions]="{exact: true}" class="text-text-soft text-decoration-none hover-text-foreground transition-colors fw-medium nav-link-custom">{{ 'NAVBAR.DASHBOARD' | translate }}</a>
                <a [routerLink]="['/user', authService.currentUser()?.username]" routerLinkActive="text-foreground fw-bold" class="text-text-soft text-decoration-none hover-text-foreground transition-colors fw-medium nav-link-custom">{{ 'NAVBAR.PUBLIC_PAGE' | translate }}</a>
                <a routerLink="/contact" routerLinkActive="text-foreground fw-bold" class="text-text-soft text-decoration-none hover-text-foreground transition-colors fw-medium nav-link-custom">{{ 'NAVBAR.CONTACT' | translate }}</a>
            </div>

            <!-- Right: Actions -->
            <div class="d-flex align-items-center gap-2 gap-md-3">
                <!-- Language Toggle -->
                <button (click)="toggleLanguage()" class="btn btn-ghost-hover btn-sm text-text-soft hover-text-foreground d-flex align-items-center gap-2 border-0 rounded-pill px-3 py-2" [title]="'NAVBAR.THEME' | translate">
                    <lucide-icon [name]="icons.Globe" [size]="16"></lucide-icon>
                    <span class="small fw-bold">{{ langService.currentLang() === 'en' ? 'AR' : 'EN' }}</span>
                </button>
                
                <!-- Notifications -->
                <app-notifications-dropdown *ngIf="authService.currentUser()"></app-notifications-dropdown>

                <!-- Logged In State: User Dropdown -->
                <div *ngIf="authService.currentUser()" class="position-relative">
                    <button (click)="toggleDropdown()" class="btn btn-ghost-hover btn-sm text-text-soft hover-text-foreground d-flex align-items-center gap-2 border-0 rounded-pill px-3 py-2" [class.text-foreground]="isDropdownOpen()">
                        <span class="d-none d-sm-inline fw-medium">{{ authService.currentUser()?.displayName || authService.currentUser()?.username }}</span>
                        <lucide-icon [name]="icons.ChevronDown" [size]="14" class="text-text-soft transition-transform" [class.rotate-180]="isDropdownOpen()"></lucide-icon>
                    </button>

                    <!-- Dropdown Menu -->
                    <div *ngIf="isDropdownOpen()" class="dropdown-menu-custom show position-absolute mt-2 p-2 bg-card border border-border shadow-soft rounded-4" style="min-width: 240px; inset-inline-end: 0;">
                        <!-- Dropdown Header -->
                        <div class="px-3 py-2 mb-2 border-bottom border-border">
                            <p class="mb-0 small text-text-soft">{{ 'NAVBAR.LOGGED_IN_AS' | translate }}</p>
                            <p class="mb-0 fw-bold text-foreground text-truncate">{{ authService.currentUser()?.username }}</p>
                        </div>

                        <a routerLink="/settings" (click)="closeDropdown()" class="dropdown-item d-flex align-items-center gap-3 rounded-3 text-text-soft hover-bg-secondary p-2 transition-all">
                            <div class="bg-muted p-2 rounded-3">
                                <lucide-icon [name]="icons.User" [size]="18"></lucide-icon>
                            </div>
                            <div class="d-flex flex-column">
                                <span class="fw-semibold text-foreground small">{{ 'NAVBAR.PROFILE_MENU' | translate }}</span>
                                <span class="text-text-whisper smaller">{{ 'NAVBAR.MANAGE_ACCOUNT' | translate }}</span>
                            </div>
                        </a>
                        
                        <a routerLink="/change-password" (click)="closeDropdown()" class="dropdown-item d-flex align-items-center gap-3 rounded-3 text-text-soft hover-bg-secondary p-2 transition-all">
                            <div class="bg-muted p-2 rounded-3">
                                <lucide-icon [name]="icons.Lock" [size]="18"></lucide-icon>
                            </div>
                            <div class="d-flex flex-column">
                                <span class="fw-semibold text-foreground small">{{ 'NAVBAR.SECURITY' | translate }}</span>
                                <span class="text-text-whisper smaller">{{ 'NAVBAR.UPDATE_PASSWORD' | translate }}</span>
                            </div>
                        </a>

                        <div class="dropdown-divider border-border my-2"></div>
                        
                        <button (click)="logout()" class="dropdown-item d-flex align-items-center gap-3 rounded-3 text-danger hover-bg-danger-subtle p-2 w-100 text-start transition-all">
                            <div class="bg-danger-subtle p-2 rounded-3">
                                <lucide-icon [name]="icons.LogOut" [size]="18"></lucide-icon>
                            </div>
                            <span class="fw-semibold small">{{ 'NAVBAR.SIGN_OUT' | translate }}</span>
                        </button>
                    </div>
                </div>

                <!-- Logged Out State -->
                <a *ngIf="!authService.currentUser()" routerLink="/auth" class="btn btn-hero btn-sm d-flex align-items-center gap-2 px-3 rounded-pill">
                    <lucide-icon [name]="icons.LogIn" [size]="16"></lucide-icon>
                    {{ 'NAVBAR.LOG_IN' | translate }}
                </a>

            </div>
        </div>
        
        <!-- Backdrop for closing dropdown -->
        <div *ngIf="isDropdownOpen()" (click)="closeDropdown()" class="position-fixed top-0 start-0 w-100 h-100" style="z-index: 40;"></div>
    </nav>
  `,
    styles: [`
    .navbar-glass {
        background-color: hsl(var(--card) / 0.8) !important;
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
    }
    .bg-primary-subtle { background-color: hsl(var(--primary) / 0.1) !important; color: hsl(var(--primary)); }
    .bg-secondary-subtle { background-color: hsl(var(--secondary)); color: hsl(var(--secondary-foreground)); }
    .bg-muted { background-color: hsl(var(--muted)); }
    .bg-danger-subtle { background-color: hsl(var(--destructive) / 0.1); color: hsl(var(--destructive)); }
    
    .transition-colors { transition: color 0.2s; }
    .transition-transform { transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .transition-all { transition: all 0.2s ease; }
    
    .hover-text-foreground:hover { color: hsl(var(--foreground)) !important; }
    .hover-bg-secondary:hover { background-color: hsl(var(--secondary)); }
    .hover-bg-danger-subtle:hover { background-color: hsl(var(--destructive) / 0.15); }

    .btn-ghost-hover:hover {
        background-color: hsl(var(--secondary));
    }

    .group:hover .group-hover-scale { transform: scale(1.1); }
    
    .nav-link-custom {
        position: relative;
        padding: 0.5rem 0;
    }
    .nav-link-custom::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 0;
        height: 2px;
        background-color: hsl(var(--primary));
        transition: width 0.3s ease;
    }
    .nav-link-custom:hover::after, .nav-link-custom.active::after {
        width: 100%;
    }

    .dropdown-menu-custom { 
        display: block; 
        animation: slideIn 0.2s cubic-bezier(0, 0, 0.2, 1); 
        transform-origin: top right;
    }
    
    .shadow-soft {
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
    }

    .rotate-180 { transform: rotate(180deg); }
    .smaller { font-size: 0.75rem; }

    @keyframes slideIn {
        from { opacity: 0; transform: translateY(-8px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `]
})
export class NavbarComponent {
    private authServiceRef = inject(AuthService);
    private router = inject(Router);
    public langService = inject(LanguageService);

    public authService = this.authServiceRef; // Expose for template
    public isDropdownOpen = signal(false);

    readonly icons = { MessageSquare, Settings, User, LogOut, Lock, ChevronDown, LogIn, Globe };

    toggleLanguage() {
        const nextLang = this.langService.currentLang() === 'en' ? 'ar' : 'en';
        this.langService.setLanguage(nextLang);
    }

    toggleDropdown() {
        this.isDropdownOpen.update(v => !v);
    }

    closeDropdown() {
        this.isDropdownOpen.set(false);
    }

    logout() {
        this.authServiceRef.logout();
        this.closeDropdown();
        this.router.navigate(['/auth']);
    }
}
