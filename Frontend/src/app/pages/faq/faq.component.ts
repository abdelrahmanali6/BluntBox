import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, HelpCircle, ChevronDown, ChevronUp } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
    selector: 'app-faq',
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
                    <div class="bg-success-glow p-3 rounded-4 text-white">
                        <lucide-icon [name]="icons.HelpCircle" [size]="32"></lucide-icon>
                    </div>
                    <div>
                        <h1 class="display-6 fw-bold text-foreground mb-0" [innerHTML]="'FAQ.TITLE' | translate"></h1>
                        <p class="text-text-soft mb-0 opacity-80">{{ 'FAQ.SUBTITLE' | translate }}</p>
                    </div>
                </div>

                <div class="accordion d-flex flex-column gap-3" id="faqAccordion">
                    
                    <div class="card glassmorphism border-border-soft overflow-hidden transition-all" *ngFor="let item of faqs; let i = index">
                        <button (click)="toggle(i)" class="card-body btn text-start d-flex justify-content-between align-items-center w-100 p-4 border-0 bg-transparent shadow-none" [class.bg-white-opacity-5]="active === i">
                            <span class="fs-5 fw-bold text-foreground pe-3">{{ item.question | translate }}</span>
                            <div class="bg-background-soft p-2 rounded-3 text-text-soft">
                                <lucide-icon [name]="active === i ? icons.ChevronUp : icons.ChevronDown" [size]="20"></lucide-icon>
                            </div>
                        </button>
                        <div class="collapse" [class.show]="active === i">
                            <div class="card-body px-4 pb-4 pt-2 text-text-soft border-top-0 lead fs-6 opacity-90">
                                {{ item.answer | translate }}
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
    .bg-success-glow { background: #10b981; box-shadow: 0 0 15px rgba(16, 185, 129, 0.4); }
    .bg-white-opacity-5 { background-color: rgba(255, 255, 255, 0.03) !important; }
    .bg-background-soft { background-color: rgba(0, 0, 0, 0.05); }
    .border-border-soft { border-color: hsl(var(--border) / 0.4) !important; }
  `]
})
export class FaqComponent {
    readonly icons = { HelpCircle, ChevronDown, ChevronUp };

    active: number | null = 0;

    faqs = [
        { question: "FAQ.Q1", answer: "FAQ.A1", isOpen: false },
        { question: "FAQ.Q2", answer: "FAQ.A2", isOpen: false },
        { question: "FAQ.Q3", answer: "FAQ.A3", isOpen: false },
        { question: "FAQ.Q4", answer: "FAQ.A4", isOpen: false },
        { question: "FAQ.Q5", answer: "FAQ.A5", isOpen: false },
        { question: "FAQ.Q6", answer: "FAQ.A6", isOpen: false },
        { question: "FAQ.Q7", answer: "FAQ.A7", isOpen: false },
        { question: "FAQ.Q8", answer: "FAQ.A8", isOpen: false },
        { question: "FAQ.Q9", answer: "FAQ.A9", isOpen: false },
        { question: "FAQ.Q10", answer: "FAQ.A10", isOpen: false },
        { question: "FAQ.Q11", answer: "FAQ.A11", isOpen: false },
        { question: "FAQ.Q12", answer: "FAQ.A12", isOpen: false },
        { question: "FAQ.Q13", answer: "FAQ.A13", isOpen: false }
    ];

    toggle(index: number) {
        this.active = this.active === index ? null : index;
    }
}
