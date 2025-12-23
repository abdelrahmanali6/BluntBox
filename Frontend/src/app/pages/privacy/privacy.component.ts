import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Shield, Lock, EyeOff, Server, Cookie } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
    selector: 'app-privacy',
    standalone: true,
    imports: [CommonModule, RouterLink, LucideAngularModule, FooterComponent, NavbarComponent, TranslateModule],
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
                
                <div class="d-flex align-items-center gap-3 mb-5">
                    <div class="bg-primary-glow p-3 rounded-4 text-white">
                        <lucide-icon [name]="icons.Shield" [size]="32"></lucide-icon>
                    </div>
                    <div>
                        <h1 class="display-6 fw-bold text-foreground mb-0" [innerHTML]="'PRIVACY.TITLE' | translate"></h1>
                        <p class="text-text-soft mb-0 opacity-80">{{ 'PRIVACY.SUBTITLE' | translate }}</p>
                    </div>
                </div>

                <div class="d-flex flex-column gap-4">
                    
                    <section class="card glassmorphism border-border-soft p-4 p-md-5">
                        <div class="d-flex align-items-center gap-3 mb-4">
                            <div class="bg-primary-subtle p-2 rounded-3 text-primary">
                                <lucide-icon [name]="icons.EyeOff" [size]="20"></lucide-icon>
                            </div>
                            <h2 class="h4 fw-bold text-foreground mb-0">{{ 'PRIVACY.SECTION1_TITLE' | translate }}</h2>
                        </div>
                        <p class="text-text-soft fs-5 opacity-90 mb-4">{{ 'PRIVACY.SECTION1_TEXT' | translate }}</p>
                        <ul class="text-text-soft fs-6 opacity-80">
                            <li *ngFor="let item of ('PRIVACY.SECTION1_LIST' | translate)" class="mb-3">{{ item }}</li>
                        </ul>
                    </section>

                    <section class="card glassmorphism border-border-soft p-4 p-md-5">
                        <div class="d-flex align-items-center gap-3 mb-4">
                            <div class="bg-primary-subtle p-2 rounded-3 text-primary">
                                <lucide-icon [name]="icons.Server" [size]="20"></lucide-icon>
                            </div>
                            <h2 class="h4 fw-bold text-foreground mb-0">{{ 'PRIVACY.SECTION2_TITLE' | translate }}</h2>
                        </div>
                        <p class="text-text-soft fs-5 opacity-90 mb-4">{{ 'PRIVACY.SECTION2_TEXT' | translate }}</p>
                        <ul class="text-text-soft fs-6 opacity-80">
                            <li *ngFor="let item of ('PRIVACY.SECTION2_LIST' | translate)" class="mb-3" [innerHTML]="item"></li>
                        </ul>
                    </section>
                    
                    <section class="card glassmorphism border-border-soft p-4 p-md-5">
                        <div class="d-flex align-items-center gap-3 mb-4">
                            <div class="bg-primary-subtle p-2 rounded-3 text-primary">
                                <lucide-icon [name]="icons.Cookie" [size]="20"></lucide-icon>
                            </div>
                            <h2 class="h4 fw-bold text-foreground mb-0">{{ 'PRIVACY.SECTION3_TITLE' | translate }}</h2>
                        </div>
                        <p class="text-text-soft fs-5 opacity-90">
                            {{ 'PRIVACY.SECTION3_TEXT' | translate }}
                        </p>
                    </section>

                    <section class="card glassmorphism border-border-soft p-4 p-md-5">
                        <div class="d-flex align-items-center gap-3 mb-4">
                            <div class="bg-primary-subtle p-2 rounded-3 text-primary">
                                <lucide-icon [name]="icons.Lock" [size]="20"></lucide-icon>
                            </div>
                            <h2 class="h4 fw-bold text-foreground mb-0">{{ 'PRIVACY.SECTION4_TITLE' | translate }}</h2>
                        </div>
                        <p class="text-text-soft fs-5 opacity-90">
                            {{ 'PRIVACY.SECTION4_TEXT' | translate }}
                        </p>
                    </section>

                    <section class="card glassmorphism border-border-soft p-4 p-md-5">
                        <div class="d-flex align-items-center gap-3 mb-4">
                            <div class="bg-primary-subtle p-2 rounded-3 text-primary">
                                <lucide-icon [name]="icons.Shield" [size]="20"></lucide-icon>
                            </div>
                            <h2 class="h4 fw-bold text-foreground mb-0">{{ 'PRIVACY.SECTION5_TITLE' | translate }}</h2>
                        </div>
                        <p class="text-text-soft fs-5 opacity-90">
                            {{ 'PRIVACY.SECTION5_TEXT' | translate }}
                        </p>
                    </section>

                </div>

                <div class="mt-5 pt-5 border-top border-border-soft">
                    <p class="text-text-whisper small text-center">{{ 'PRIVACY.LAST_UPDATED' | translate }}</p>
                </div>
            </div>
        </div>
      </main>
      
      <app-footer></app-footer>
    </div>
  `,
    styles: [`
    .bg-primary-glow { background: hsl(var(--primary)); box-shadow: 0 0 15px hsl(var(--primary) / 0.4); }
    .bg-primary-subtle { background-color: hsl(var(--primary) / 0.1) !important; color: hsl(var(--primary)); }
    .border-border-soft { border-color: hsl(var(--border) / 0.4) !important; }
  `]
})
export class PrivacyComponent {
    readonly icons = { Shield, Lock, EyeOff, Server, Cookie };
}
