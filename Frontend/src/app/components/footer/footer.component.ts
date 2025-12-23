import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, MessageSquare, Github, Info } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterLink, LucideAngularModule, TranslateModule],
    template: `
    <footer class="border-top border-border py-4 mt-auto bg-card position-relative" style="z-index: 10;">
        <div class="container-lg d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <!-- Branding -->
            <div class="d-flex align-items-center gap-2">
                 <lucide-icon [name]="icons.MessageSquare" class="text-text-soft" [size]="20"></lucide-icon>
                 <span class="fw-bold text-foreground">BluntBox</span>
            </div>

            <!-- Copyright -->
            <div class="text-text-soft small text-center text-md-start" [innerHTML]="'FOOTER.COPYRIGHT' | translate:{year: currentYear}">
            </div>

            <!-- Links & Social -->
            <div class="d-flex gap-4 align-items-center">
                <div class="d-flex gap-3">
                    <a routerLink="/terms" class="footer-link small">{{ 'FOOTER.TERMS' | translate }}</a>
                    <a routerLink="/privacy" class="footer-link small">{{ 'FOOTER.PRIVACY' | translate }}</a>
                    <a routerLink="/faq" class="footer-link small">{{ 'FOOTER.FAQ' | translate }}</a>
                </div>
                <div class="border-start border-border ps-3 d-flex gap-3">
                    <a href="https://github.com/abdelrahmanali6/BluntBox" target="_blank" class="social-icon-link" title="View on GitHub">
                        <lucide-icon [name]="icons.Github" [size]="18"></lucide-icon>
                    </a>
                </div>
            </div>
        </div>
    </footer>
  `,
    styles: [`
    .footer-link {
        color: hsl(var(--text-soft));
        text-decoration: none;
        transition: color 0.2s;
        font-weight: 500;
    }
    .footer-link:hover { color: hsl(var(--foreground)); }
    
    .social-icon-link {
        color: hsl(var(--text-soft));
        transition: all 0.2s ease;
        text-decoration: none;
    }
    .social-icon-link:hover {
        color: hsl(var(--foreground));
        transform: translateY(-2px);
    }
  `]
})
export class FooterComponent {
    readonly icons = { MessageSquare, Github, Info };
    readonly currentYear = new Date().getFullYear();
}
