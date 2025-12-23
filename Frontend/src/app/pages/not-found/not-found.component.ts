import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Home } from 'lucide-angular';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div class="min-vh-100 d-flex flex-column align-items-center justify-content-center bg-background text-center p-4 position-relative overflow-hidden">
      <!-- Global background elements -->
      <div class="position-absolute top-0 start-0 w-100 h-100 bg-dot-pattern pointer-events-none" style="z-index: 0;"></div>
      <div class="ambient-blob primary" style="top: 20%; left: 20%; opacity: 0.15;"></div>
      <div class="ambient-blob secondary" style="bottom: 20%; right: 20%; opacity: 0.15;"></div>

      <div class="position-relative z-1 fade-in">
        <h1 class="display-1 fw-black text-gradient-primary mb-2" style="font-size: clamp(8rem, 20vw, 12rem); line-height: 1;">404</h1>
        <p class="fs-3 text-foreground mb-5 opacity-90 fw-medium">Oops! The secret you're looking for doesn't exist.</p>
        
        <a routerLink="/" class="btn btn-hero btn-lg px-5 py-3 shadow-primary-glow d-inline-flex align-items-center gap-3">
            <lucide-icon [name]="icons.Home" [size]="20"></lucide-icon>
            Back to Safety
        </a>
      </div>
    </div>
  `,
  styles: [`
    .fw-black { font-weight: 900; }
  `]
})
export class NotFoundComponent {
  readonly icons = { Home };
}
