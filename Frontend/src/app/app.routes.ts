import { Routes } from '@angular/router';
import { AuthComponent } from './pages/auth/auth.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PublicProfileComponent } from './pages/public-profile/public-profile.component';
import { MessageDetailComponent } from './pages/message-detail/message-detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { FaqComponent } from './pages/faq/faq.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { authGuard } from './core/guards/auth.guard';
import { recipientResolver } from './core/resolvers/recipient.resolver';

import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { HomeComponent } from './pages/home/home.component';
import { ContactComponent } from './pages/contact/contact.component';
import { TermsComponent } from './pages/terms/terms.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';

export const routes: Routes = [
    { path: '', component: HomeComponent, title: 'BluntBox | Honest, Anonymous Feedback' },
    {
        path: 'auth',
        component: AuthComponent,
        title: 'Sign Up | BluntBox'
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
        title: 'Inbox | BluntBox'
    },
    {
        path: 'notifications',
        component: NotificationsComponent,
        canActivate: [authGuard],
        title: 'Notifications | BluntBox'
    },
    {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [authGuard],
        title: 'Settings | BluntBox'
    },
    {
        path: 'change-password',
        component: ChangePasswordComponent,
        canActivate: [authGuard],
        title: 'Change Password | BluntBox'
    },
    { path: 'privacy', component: PrivacyComponent, title: 'Privacy Policy | BluntBox' },
    { path: 'faq', component: FaqComponent, title: 'FAQ | BluntBox' },
    { path: 'contact', component: ContactComponent, title: 'Contact Us | BluntBox' },
    { path: 'terms', component: TermsComponent, title: 'Terms of Service | BluntBox' },
    {
        path: 'user/:username',
        component: PublicProfileComponent,
        resolve: { recipient: recipientResolver },
        title: 'Send Feedback | BluntBox'
    },
    {
        path: 'p/:slug',
        component: PublicProfileComponent,
        resolve: { recipient: recipientResolver },
        title: 'Send Feedback | BluntBox'
    },
    {
        path: 'message/:id',
        component: MessageDetailComponent,
        title: 'Message | BluntBox'
    },
    {
        path: 'not-found',
        component: NotFoundComponent,
        title: 'Page Not Found | BluntBox'
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'not-found'
    }
];
