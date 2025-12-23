import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthPageComponent } from '../../components/auth-page/auth-page.component';

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [CommonModule, AuthPageComponent],
    template: `
    <app-auth-page></app-auth-page>
  `
})
export class AuthComponent { }
