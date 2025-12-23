import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Mail, MessageSquare, Shield, Github } from 'lucide-angular';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, NavbarComponent, FooterComponent, RouterLink, TranslateModule],
    template: `
    <div class="min-vh-100 bg-background d-flex flex-column position-relative overflow-hidden">
        <!-- Global background elements -->
        <div class="position-absolute top-0 start-0 w-100 h-100 bg-dot-pattern pointer-events-none" style="z-index: 0;"></div>
        <div class="ambient-blob primary" style="top: -100px; left: -100px; opacity: 0.1;"></div>
        <div class="ambient-blob secondary" style="bottom: -100px; right: -100px; opacity: 0.1;"></div>

      <app-navbar></app-navbar>

      <main class="container-lg py-5 fade-in flex-grow-1 position-relative z-1">
        <div class="row justify-content-center">
            <div class="col-12 col-md-10 col-lg-8">
                
                <div class="text-center mb-5 fade-in">
                    <div class="bg-primary-glow d-inline-flex p-4 rounded-5 text-white mb-4 shadow-primary-glow pulse-animation">
                        <lucide-icon [name]="icons.Mail" [size]="48"></lucide-icon>
                    </div>
                    <h1 class="display-5 fw-bold text-foreground mb-3" [innerHTML]="'CONTACT.TITLE' | translate"></h1>
                    <p class="lead text-text-soft mx-auto opacity-80" style="max-width: 600px;">
                        {{ 'CONTACT.SUBTITLE' | translate }}
                    </p>
                </div>

                <div class="row g-4 mb-5">
                    <!-- Email Card -->
                    <div class="col-md-6">
                        <div class="card glassmorphism border-border-soft h-100 p-4 p-md-5 text-center fade-in hover-translate-up transition-all">
                            <div class="mb-4 text-primary">
                                <lucide-icon [name]="icons.Mail" [size]="40"></lucide-icon>
                            </div>
                            <h3 class="h4 fw-bold text-foreground mb-3">{{ 'CONTACT.SUPPORT_TITLE' | translate }}</h3>
                            <p class="text-text-soft mb-4 opacity-80">{{ 'CONTACT.SUPPORT_DESC' | translate }}</p>
                            <a href="mailto:bluntbox@atomicmail.io" class="h5 text-gradient-primary text-decoration-none fw-bold">
                                bluntbox&#64;atomicmail.io
                            </a>
                        </div>
                    </div>

                    <!-- Community Card -->
                    <div class="col-md-6">
                        <div class="card glassmorphism border-border-soft h-100 p-4 p-md-5 text-center fade-in hover-translate-up transition-all" style="animation-delay: 0.1s;">
                            <div class="mb-4 text-foreground">
                                <lucide-icon [name]="icons.Github" [size]="40"></lucide-icon>
                            </div>
                            <h3 class="h4 fw-bold text-foreground mb-3">{{ 'CONTACT.OPENSOURCE_TITLE' | translate }}</h3>
                            <p class="text-text-soft mb-4 opacity-80">{{ 'CONTACT.OPENSOURCE_DESC' | translate }}</p>
                            <div class="d-flex justify-content-center gap-3">
                                <a href="https://github.com/abdelrahmanali6/BluntBox" target="_blank" class="btn btn-hero d-flex align-items-center gap-3 px-4 shadow-primary-glow">
                                    <lucide-icon [name]="icons.Github" [size]="20"></lucide-icon>
                                    {{ 'CONTACT.GITHUB_BTN' | translate }}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- FAQ Redirect -->
                <div class="card glassmorphism border-border-soft p-4 text-center fade-in rounded-4" style="animation-delay: 0.2s;">
                    <p class="mb-0 text-text-soft">
                        {{ 'CONTACT.FAQ_TEXT' | translate }} 
                        <a routerLink="/faq" class="text-primary text-decoration-none fw-bold">{{ 'CONTACT.FAQ_LINK' | translate }}</a>.
                    </p>
                </div>

            </div>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `,
    styles: [`
    .bg-primary-glow { background: hsl(var(--primary)); box-shadow: 0 0 20px hsl(var(--primary) / 0.5); }
    .bg-primary-subtle { background-color: hsl(var(--primary) / 0.1) !important; color: hsl(var(--primary)); }
    .border-border-soft { border-color: hsl(var(--border) / 0.4) !important; }
    .hover-translate-up {
        transition: transform 0.3s ease;
        &:hover { transform: translateY(-8px); }
    }
  `]
})
export class ContactComponent {
    readonly icons = { Mail, MessageSquare, Shield, Github };
}
