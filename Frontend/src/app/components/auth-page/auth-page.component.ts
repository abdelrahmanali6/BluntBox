import { Component, inject, ChangeDetectorRef, NgZone, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule, ArrowRight, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-angular';
import { BluntBoxLogoComponent } from '../icons/blunt-box-logo.component';
import { AuthService } from '../../core/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

type AuthMode = 'login' | 'register';

@Component({
    selector: 'app-auth-page',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        LucideAngularModule,
        BluntBoxLogoComponent,
        TranslateModule
    ],
    templateUrl: './auth-page.component.html',
    styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);
    private translate = inject(TranslateService);
    private cdr = inject(ChangeDetectorRef);
    private zone = inject(NgZone);
    private fb = inject(FormBuilder);

    mode: AuthMode = 'register';
    showPassword = false;
    isLoading = false;
    error = signal<string | null>(null);

    // Reactive Forms
    loginForm!: FormGroup;
    registerForm!: FormGroup;

    // Icons for template
    readonly icons = {
        ArrowRight, Mail, Lock, User, Eye, EyeOff, AlertCircle
    };

    ngOnInit() {
        this.initForms();
    }

    private initForms() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });

        this.registerForm = this.fb.group({
            username: ['', [Validators.required]],
            displayName: [''],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.passwordMatchValidator });
    }

    private passwordMatchValidator(control: AbstractControl) {
        const password = control.get('password')?.value;
        const confirmPassword = control.get('confirmPassword')?.value;

        if (password !== confirmPassword) {
            control.get('confirmPassword')?.setErrors({ mismatch: true });
            return { mismatch: true };
        } else {
            const confirmControl = control.get('confirmPassword');
            if (confirmControl?.hasError('mismatch')) {
                confirmControl.setErrors(null);
            }
            return null;
        }
    }

    toggleMode() {
        this.mode = this.mode === 'register' ? 'login' : 'register';
        this.error.set(null);
        if (this.mode === 'register') {
            this.registerForm.reset();
        } else {
            this.loginForm.reset();
        }
    }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    get currentForm(): FormGroup {
        return this.mode === 'register' ? this.registerForm : this.loginForm;
    }

    handleSubmit() {
        if (this.currentForm.invalid) {
            this.currentForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.error.set(null);

        const formValue = this.currentForm.value;

        if (this.mode === 'register') {
            this.authService.register({
                userName: formValue.username,
                email: formValue.email,
                password: formValue.password,
                displayName: formValue.displayName || null
            }).subscribe({
                next: () => {
                    this.zone.run(() => {
                        this.router.navigate(['/dashboard']);
                    });
                },
                error: (err) => {
                    this.handleAuthError(err);
                }
            });
        } else {
            this.authService.login({
                email: formValue.email,
                password: formValue.password
            }).subscribe({
                next: () => {
                    this.zone.run(() => {
                        this.router.navigate(['/dashboard']);
                    });
                },
                error: (err) => {
                    this.zone.run(() => {
                        this.isLoading = false;
                        this.translate.get('AUTH.INVALID_CREDENTIALS').subscribe(res => {
                            this.error.set(res);
                            this.cdr.detectChanges();
                        });
                    });
                }
            });
        }
    }

    private handleAuthError(err: any) {
        this.zone.run(() => {
            this.isLoading = false;
            console.error('Registration Error:', JSON.stringify(err.error, null, 2));
            let key = 'AUTH.REGISTRATION_FAILED';

            if (err.error && typeof err.error === 'object') {
                if (err.error.errors) {
                    const messages = Object.values(err.error.errors).flat().join(', ');
                    key = messages ? '' : 'AUTH.VALIDATION_FAILED';
                    if (messages) {
                        this.error.set(messages);
                        this.cdr.detectChanges();
                        return;
                    }
                }
                else if (err.error.error) {
                    key = err.error.error;
                    this.error.set(key);
                    this.cdr.detectChanges();
                    return;
                }
                else {
                    key = 'AUTH.REGISTRATION_FAILED';
                }
            } else {
                key = 'AUTH.REGISTRATION_FAILED';
            }

            this.translate.get(key).subscribe(res => {
                this.error.set(res);
                this.cdr.detectChanges();
            });
        });
    }
}
