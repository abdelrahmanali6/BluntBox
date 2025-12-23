import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environment';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models/api.models';

export const TOKEN_KEY = 'bluntbox_token';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/api/auth`;

    isAuthenticated = computed(() => !!this.currentUser());

    // Signal to track login user
    currentUser = signal<{ id: string, username: string, email?: string, displayName?: string | null } | null>(this.getUserFromToken());

    constructor(private http: HttpClient) { }

    getToken(): string | null {
        return localStorage.getItem(TOKEN_KEY);
    }

    private setToken(token: string) {
        localStorage.setItem(TOKEN_KEY, token);
        this.currentUser.set(this.getUserFromToken());
    }

    clearToken() {
        localStorage.removeItem(TOKEN_KEY);
        this.currentUser.set(null);
    }

    private getUserFromToken(): { id: string, username: string, email?: string, displayName?: string | null } | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('Decoded Token Payload:', payload); // Debugging line

            // ASP.NET Core Identity uses specific claim names
            // 'sub' is usually ID, 'unique_name' or 'name' is username
            return {
                id: payload.sub || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                username: payload.unique_name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || payload.name,
                email: payload.email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
                displayName: payload.displayName || payload.given_name || payload['displayName'] || null
            };
        } catch (e) {
            console.error('Failed to decode token', e);
            return null;
        }
    }

    register(payload: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
            tap(res => this.setToken(res.token))
        );
    }

    login(payload: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
            tap(res => this.setToken(res.token))
        );
    }

    logout() {
        this.clearToken();
    }
}
