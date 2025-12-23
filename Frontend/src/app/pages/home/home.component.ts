import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Shield, Zap, MessageSquare, ArrowRight, Heart, Lock, Globe, User } from 'lucide-angular';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthService } from '../../core/services/auth.service';
import { BluntBoxLogoComponent } from '../../components/icons/blunt-box-logo.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, RouterLink, LucideAngularModule, FooterComponent, NavbarComponent, BluntBoxLogoComponent, TranslateModule],
    template: `
    <div class="min-vh-100 bg-background d-flex flex-column overflow-hidden position-relative">
      <!-- Background texture & Ambient effects -->
      <div class="position-absolute top-0 start-0 w-100 h-100 bg-dot-pattern pointer-events-none" style="z-index: 0;"></div>
      <div class="position-absolute top-0 start-0 w-100 h-100 overflow-hidden pointer-events-none" style="z-index: 0;">
        <div class="ambient-blob primary"></div>
        <div class="ambient-blob secondary"></div>
        <div class="ambient-blob accent"></div>
      </div>

      <app-navbar></app-navbar>

      <!-- Hero Section -->
      <main class="flex-grow-1 position-relative z-1 d-flex align-items-center py-5">
        <div class="container-lg py-4">
          <div class="row align-items-center g-5">
            <div class="col-lg-6 text-center text-lg-start fade-in">
              <div class="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-primary-subtle text-primary mb-4 fw-medium small border border-primary-subtle">
                <lucide-icon [name]="icons.Shield" [size]="14"></lucide-icon>
                <span>{{ 'HOME.SAFE_SECURE' | translate }}</span>
              </div>
              
              <h1 class="display-3 fw-bold text-foreground mb-4 lh-sm" [innerHTML]="'HOME.HERO_TITLE' | translate">
              </h1>
              
              <p class="lead text-text-soft mb-5 mx-auto mx-lg-0" style="max-width: 500px; line-height: 1.7;">
                {{ 'HOME.HERO_SUBTITLE' | translate }}
              </p>

              <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
                <a *ngIf="!authService.currentUser()" routerLink="/auth" class="btn btn-hero btn-lg px-5 py-3 d-flex align-items-center justify-content-center gap-3 shadow-primary-glow rounded-pill fw-bold">
                  {{ 'HOME.START_JOURNEY' | translate }}
                  <lucide-icon [name]="icons.ArrowRight" [size]="18"></lucide-icon>
                </a>
                <a *ngIf="authService.currentUser()" routerLink="/dashboard" class="btn btn-hero btn-lg px-5 py-3 d-flex align-items-center justify-content-center gap-3 shadow-primary-glow rounded-pill fw-bold">
                  {{ 'HOME.MY_DASHBOARD' | translate }}
                  <lucide-icon [name]="icons.ArrowRight" [size]="18"></lucide-icon>
                </a>
                <a routerLink="/faq" class="btn btn-outline-border btn-lg px-4 py-3 text-foreground d-flex align-items-center justify-content-center gap-2 glass-hover rounded-pill">
                  {{ 'HOME.HOW_IT_WORKS' | translate }}
                </a>
              </div>

              <div class="mt-5 pt-3 d-flex align-items-center gap-4 justify-content-center justify-content-lg-start text-text-whisper small">
                <div class="d-flex align-items-center gap-1">
                  <lucide-icon [name]="icons.Lock" [size]="14" class="text-primary"></lucide-icon>
                  {{ 'HOME.TOTALLY_PRIVATE' | translate }}
                </div>
                <div class="d-flex align-items-center gap-1">
                  <lucide-icon [name]="icons.Heart" [size]="14" class="text-danger"></lucide-icon>
                  {{ 'HOME.BUILT_FOR_TRIBES' | translate }}
                </div>
                <div class="d-flex align-items-center gap-1">
                   <lucide-icon [name]="icons.Shield" [size]="14" class="text-info"></lucide-icon>
                  {{ 'HOME.SAFE_SPACE' | translate }}
                </div>
              </div>
            </div>

            <div class="col-lg-6 hero-visual position-relative z-1 d-none d-lg-block fade-in" style="animation-delay: 0.2s;">
                <div class="position-relative d-flex justify-content-center align-items-center py-5">
                    <!-- Central Profile Preview Card -->
                    <div class="card glass-card-premium border-primary-subtle p-4 profile-card shadow-lg z-2 animate-breathe" 
                         style="width: 320px; border-radius: 3rem; transform: rotate(-2deg);">
                        <div class="d-flex flex-column align-items-center py-4">
                            <div class="profile-icon-container mb-4 position-relative">
                                <div class="bg-primary shadow-primary-glow p-4 rounded-circle text-white animate-glow-pulse">
                                    <lucide-icon [name]="icons.User" [size]="48"></lucide-icon>
                                </div>
                                <!-- Notification Badge -->
                                <div class="position-absolute top-0 end-0" style="transform: translate(15%, -15%);">
                                    <div class="badge bg-danger rounded-pill px-2 py-1 pulse-animation shadow-sm" 
                                         style="font-size: 14px; border: 3px solid hsl(var(--card));">3</div>
                                </div>
                            </div>
                            <h3 class="h4 fw-bold text-foreground mb-1">{{ 'HOME.YOUR_SPACE' | translate }}</h3>
                            <p class="text-text-whisper small mb-4 opacity-75">bluntbox.link/you</p>
                            
                            <div class="d-flex flex-column gap-2 w-100 px-3">
                                <div class="bg-primary bg-opacity-10 p-3 rounded-4 border border-primary border-opacity-10 d-flex align-items-center gap-3">
                                    <div class="bg-primary p-2 rounded-circle text-white">
                                        <lucide-icon [name]="icons.Heart" [size]="14"></lucide-icon>
                                    </div>
                                    <div class="flex-grow-1">
                                        <div class="bg-text-soft bg-opacity-20 rounded-pill w-75 mb-2" style="height: 6px;"></div>
                                        <div class="bg-text-soft bg-opacity-10 rounded-pill w-50" style="height: 6px;"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Floating Ambient Glows -->
                    <div class="position-absolute top-50 start-50 translate-middle w-100 h-100 z-0">
                        <div class="bg-primary-glow position-absolute top-50 start-50 translate-middle rounded-circle opacity-20 animate-breathe" 
                             style="width: 400px; height: 400px; filter: blur(80px);"></div>
                    </div>

                    <!-- Floating Card 1: Anonymous Message -->
                    <div class="card glassmorphism border-border-soft p-3 floating-card floating-card-1 shadow-primary-glow" 
                         style="width: 240px; transform: rotate(5deg);">
                        <div class="d-flex gap-3 align-items-start">
                            <div class="bg-secondary p-2 rounded-3 text-primary-light" style="color: hsl(var(--primary));">
                                <lucide-icon [name]="icons.MessageSquare" [size]="18"></lucide-icon>
                            </div>
                            <div class="flex-grow-1">
                                <p class="small text-foreground mb-1 fw-medium">"Love your energy! Keep going."</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="text-text-whisper" style="font-size: 10px;">Just now • Anonymous</span>
                                    <lucide-icon [name]="icons.Heart" class="text-danger opacity-50" [size]="12"></lucide-icon>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Floating Card 2: Safe Indicator -->
                    <div class="card glassmorphism border-border-soft p-2 px-3 floating-card floating-card-2 shadow-sm" 
                         style="width: 180px; transform: rotate(-8deg);">
                        <div class="d-flex align-items-center gap-2">
                            <div class="bg-success p-1 rounded-circle">
                                <lucide-icon [name]="icons.Shield" class="text-white" [size]="12"></lucide-icon>
                            </div>
                            <span class="small fw-bold text-foreground">{{ 'HOME.SAFE_ENCRYPTED' | translate }}</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Stats / Highlights Section -->
      <section class="py-5 border-top border-bottom border-border-soft glassmorphism position-relative overflow-hidden">
          <div class="container py-lg-4">
              <div class="row g-4 justify-content-center text-center">
                  <div class="col-6 col-md-3">
                      <h3 class="display-6 fw-bold text-gradient-primary mb-1">100%</h3>
                      <p class="text-text-soft small text-uppercase fw-bold ls-1">{{ 'HOME.ANONYMOUS' | translate }}</p>
                  </div>
                  <div class="col-6 col-md-3">
                      <h3 class="display-6 fw-bold text-gradient-primary mb-1">FREE</h3>
                      <p class="text-text-soft small text-uppercase fw-bold ls-1">{{ 'HOME.FREE_FOR_ALL' | translate }}</p>
                  </div>
                  <div class="col-6 col-md-3">
                      <h3 class="display-6 fw-bold text-gradient-primary mb-1">24/7</h3>
                      <p class="text-text-soft small text-uppercase fw-bold ls-1">{{ 'HOME.MODERATED' | translate }}</p>
                  </div>
              </div>
          </div>
      </section>

      <!-- How it Works -->
      <section class="py-5 bg-card border-top border-bottom border-border-soft position-relative z-1 section-separation">
        <div class="container-lg py-5">
            <div class="text-center mb-5">
                <h2 class="display-6 fw-bold text-foreground mb-3">{{ 'HOME.SIMPLE_APPROACHABLE' | translate }}</h2>
                <p class="text-text-soft lead fs-6 opacity-80">{{ 'HOME.GET_STARTED_SUBTITLE' | translate }}</p>
            </div>
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="step-card glassmorphism border-border-soft text-center p-5 rounded-5 h-100">
                        <div class="step-number mb-4 shadow-primary-glow">1</div>
                        <h4 class="h5 fw-bold text-foreground mb-3">{{ 'HOME.STEP1_TITLE' | translate }}</h4>
                        <p class="text-text-soft mb-0 opacity-90">{{ 'HOME.STEP1_DESC' | translate }}</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="step-card glassmorphism border-border-soft text-center p-5 rounded-5 h-100">
                        <div class="step-number mb-4 shadow-info-glow" style="background: #38bdf8">2</div>
                        <h4 class="h5 fw-bold text-foreground mb-3">{{ 'HOME.STEP2_TITLE' | translate }}</h4>
                        <p class="text-text-soft mb-0 opacity-90">{{ 'HOME.STEP2_DESC' | translate }}</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="step-card glassmorphism border-border-soft text-center p-5 rounded-5 h-100">
                        <div class="step-number mb-4 shadow-success-glow" style="background: #10b981">3</div>
                        <h4 class="h5 fw-bold text-foreground mb-3">{{ 'HOME.STEP3_TITLE' | translate }}</h4>
                        <p class="text-text-soft mb-0 opacity-90">{{ 'HOME.STEP3_DESC' | translate }}</p>
                    </div>
                </div>
            </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-5 bg-background z-1">
         <div class="container-lg py-5">
            <div class="text-center mb-5">
               <h2 class="display-6 fw-bold text-foreground">{{ 'HOME.WHY_JOIN_TITLE' | translate }}</h2>
               <p class="text-text-soft lead fs-6 opacity-80">{{ 'HOME.WHY_JOIN_SUBTITLE' | translate }}</p>
            </div>
            <div class="row g-4 justify-content-center">
               <div class="col-md-4">
                  <div class="p-4 text-center glass-hover rounded-5 transition-all">
                     <div class="bg-primary-subtle text-primary p-3 rounded-4 d-inline-flex mb-4 border border-primary-subtle shadow-sm">
                        <lucide-icon [name]="icons.Lock" [size]="28"></lucide-icon>
                     </div>
                     <h4 class="h5 fw-bold text-foreground mb-3">{{ 'HOME.FEAT1_TITLE' | translate }}</h4>
                     <p class="text-text-soft mb-0 opacity-80">{{ 'HOME.FEAT1_DESC' | translate }}</p>
                  </div>
               </div>
               <div class="col-md-4">
                  <div class="p-4 text-center glass-hover rounded-5 transition-all">
                     <div class="bg-info-subtle text-info p-3 rounded-4 d-inline-flex mb-4 border border-info-subtle shadow-sm" style="background-color: rgba(56, 189, 248, 0.1) !important; color: rgb(56, 189, 248);">
                        <lucide-icon [name]="icons.Shield" [size]="28"></lucide-icon>
                     </div>
                     <h4 class="h5 fw-bold text-foreground mb-3">{{ 'HOME.FEAT2_TITLE' | translate }}</h4>
                     <p class="text-text-soft mb-0 opacity-80">{{ 'HOME.FEAT2_DESC' | translate }}</p>
                  </div>
               </div>
               <div class="col-md-4">
                  <div class="p-4 text-center glass-hover rounded-5 transition-all">
                     <div class="bg-success-subtle text-success p-3 rounded-4 d-inline-flex mb-4 border border-success-subtle shadow-sm" style="background-color: rgba(16, 185, 129, 0.1) !important; color: rgb(16, 185, 129);">
                        <lucide-icon [name]="icons.Heart" [size]="28"></lucide-icon>
                     </div>
                     <h4 class="h5 fw-bold text-foreground mb-3">{{ 'HOME.FEAT3_TITLE' | translate }}</h4>
                     <p class="text-text-soft mb-0 opacity-80">{{ 'HOME.FEAT3_DESC' | translate }}</p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <!-- Final CTA -->
      <section class="py-5 z-1">
          <div class="container-lg py-5 text-center">
              <div class="card glassmorphism border-border-soft p-5 rounded-5 overflow-hidden position-relative shadow-2xl">
                  <div class="position-relative z-1 p-md-4">
                      <h2 class="display-4 fw-bold text-foreground mb-4">{{ 'HOME.FINAL_CTA_TITLE' | translate }}</h2>
                      <p class="lead text-text-soft mb-5 mx-auto opacity-80" style="max-width: 600px;">
                          {{ 'HOME.FINAL_CTA_DESC' | translate }}
                      </p>
                          <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center">
                              <a *ngIf="!authService.currentUser()" routerLink="/auth" class="btn btn-hero btn-lg px-5 py-3 rounded-pill d-flex align-items-center justify-content-center gap-3 shadow-primary-glow fw-bold">
                                  {{ 'HOME.CLAIM_LINK' | translate }}
                                  <lucide-icon [name]="icons.ArrowRight" [size]="18"></lucide-icon>
                              </a>
                              <a *ngIf="authService.currentUser()" routerLink="/dashboard" class="btn btn-hero btn-lg px-5 py-3 rounded-pill d-flex align-items-center justify-content-center gap-3 shadow-primary-glow fw-bold">
                                  {{ 'HOME.MY_DASHBOARD' | translate }}
                                  <lucide-icon [name]="icons.ArrowRight" [size]="18"></lucide-icon>
                              </a>
                          </div>
                  </div>
              </div>
          </div>
      </section>

      <app-footer></app-footer>
    </div>
  `,
    styles: [`
    .profile-icon-container {
        box-shadow: 0 10px 30px -10px hsl(var(--primary) / 0.3);
    }
    
    .hero-visual { perspective: 1200px; }
    .hero-visual .card { backface-visibility: hidden; transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .hero-visual .card:hover { transform: scale(1.08) translateY(-10px) rotate(0deg) !important; z-index: 10 !important; }
    
    .rotate-3 { transform: rotate(3deg); }
    .-rotate-3 { transform: rotate(-3deg); }
    .rotate-6 { transform: rotate(6deg); }

    .floating-card-1 { animation: float-slow 5s infinite alternate ease-in-out; }
    .floating-card-2 { animation: float-slow 7s infinite alternate-reverse ease-in-out; animation-delay: 1s; }

    @keyframes float-slow {
        from { transform: translateY(0) rotate(inherit); }
        to { transform: translateY(-20px) rotate(inherit); }
    }

    .step-card { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .step-card:hover { transform: translateY(-15px); border-color: hsl(var(--primary) / 0.5) !important; }
    
    .step-number {
        width: 65px;
        height: 65px;
        background-color: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
        font-size: 26px;
        font-weight: 800;
        border-radius: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        box-shadow: 0 10px 20px -5px hsl(var(--primary) / 0.3);
    }
    .border-border-soft { border-color: hsl(var(--border) / 0.4) !important; }
  `]
})
export class HomeComponent {
    private authServiceRef = inject(AuthService);
    public authService = this.authServiceRef;

    readonly icons = { Shield, Zap, MessageSquare, ArrowRight, Heart, Lock, Globe, User };
}
