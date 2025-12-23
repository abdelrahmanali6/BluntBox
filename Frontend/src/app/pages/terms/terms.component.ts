import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Shield, Scale, FileText, AlertTriangle } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
    selector: 'app-terms',
    standalone: true,
    imports: [CommonModule, LucideAngularModule, NavbarComponent, FooterComponent, TranslateModule, RouterLink],
    template: `
    <div class="min-vh-100 bg-background d-flex flex-column position-relative overflow-hidden">
        <!-- Global background elements -->
        <div class="position-absolute top-0 start-0 w-100 h-100 bg-dot-pattern pointer-events-none" style="z-index: 0;"></div>
        <div class="ambient-blob primary" style="top: -100px; right: -100px; opacity: 0.1;"></div>
        <div class="ambient-blob secondary" style="bottom: -100px; left: -100px; opacity: 0.1;"></div>

      <app-navbar></app-navbar>

      <main class="container-lg py-5 fade-in flex-grow-1 position-relative z-1">
        <div class="row justify-content-center">
            <div class="col-12 col-md-10 col-lg-8">
                
                <div class="mb-5 text-center">
                    <h1 class="display-6 fw-bold text-foreground mb-2" [innerHTML]="'TERMS.TITLE' | translate"></h1>
                    <p class="text-text-soft opacity-80">{{ 'TERMS.LAST_UPDATED' | translate }}</p>
                </div>

                <div class="card glassmorphism border-border-soft p-4 p-md-5 mb-4 shadow-lg">
                    <div class="d-flex align-items-center gap-3 mb-5 p-3 rounded-4 bg-warning-subtle border border-warning border-opacity-10 text-warning">
                        <lucide-icon [name]="icons.AlertTriangle" [size]="24" class="flex-shrink-0"></lucide-icon>
                        <p class="mb-0 fw-medium small">{{ 'TERMS.CAUTION' | translate }}</p>
                    </div>

                    <div class="legal-content text-text-soft">
                        <section class="mb-5">
                            <h2 class="h5 fw-bold text-foreground mb-3 d-flex align-items-center gap-2">
                                <span class="bg-primary-subtle text-primary p-2 rounded-2 fs-7">01</span>
                                {{ 'TERMS.SECTION1_TITLE' | translate }}
                            </h2>
                            <p class="opacity-90 lead fs-6">{{ 'TERMS.SECTION1_TEXT' | translate }}</p>
                        </section>

                        <section class="mb-5">
                            <h2 class="h5 fw-bold text-foreground mb-3 d-flex align-items-center gap-2">
                                <span class="bg-primary-subtle text-primary p-2 rounded-2 fs-7">02</span>
                                {{ 'TERMS.SECTION2_TITLE' | translate }}
                            </h2>
                            <p class="opacity-90 lead fs-6">{{ 'TERMS.SECTION2_TEXT' | translate }}</p>
                        </section>

                        <section class="mb-5">
                            <h2 class="h5 fw-bold text-foreground mb-3 d-flex align-items-center gap-2">
                                <span class="bg-primary-subtle text-primary p-2 rounded-2 fs-7">03</span>
                                {{ 'TERMS.SECTION3_TITLE' | translate }}
                            </h2>
                            <p class="opacity-90 lead fs-6">{{ 'TERMS.SECTION3_TEXT' | translate }}</p>
                            <ul class="opacity-80 fs-6">
                                <li *ngFor="let item of ('TERMS.CONDUCT_LIST' | translate)" class="mb-2">{{ item }}</li>
                            </ul>
                        </section>

                        <section class="mb-5">
                            <h2 class="h5 fw-bold text-foreground mb-3 d-flex align-items-center gap-2">
                                <span class="bg-primary-subtle text-primary p-2 rounded-2 fs-7">04</span>
                                {{ 'TERMS.SECTION4_TITLE' | translate }}
                            </h2>
                            <p class="opacity-90 lead fs-6" [innerHTML]="'TERMS.SECTION4_TEXT' | translate"></p>
                        </section>

                        <section class="mb-0">
                            <h2 class="h5 fw-bold text-foreground mb-3 d-flex align-items-center gap-2">
                                <span class="bg-primary-subtle text-primary p-2 rounded-2 fs-7">05</span>
                                {{ 'TERMS.SECTION5_TITLE' | translate }}
                            </h2>
                            <p class="opacity-90 lead fs-6">{{ 'TERMS.SECTION5_TEXT' | translate }}</p>
                        </section>
                    </div>
                </div>

            </div>
        </div>
      </main>

      <app-footer></app-footer>
    </div>
  `,
    styles: [`
    .legal-content p { line-height: 1.7; }
    .legal-content ul { padding-left: 1.25rem; }
    .bg-primary-subtle { background-color: hsl(var(--primary) / 0.1) !important; color: hsl(var(--primary)); }
    .bg-warning-subtle { background-color: rgba(251, 191, 36, 0.08) !important; color: rgb(251, 191, 36); }
    .border-border-soft { border-color: hsl(var(--border) / 0.4) !important; }
    .fs-7 { font-size: 0.8rem; }
  `]
})
export class TermsComponent {
    readonly icons = { Shield, Scale, FileText, AlertTriangle };
}
