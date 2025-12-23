import { Injectable, inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { BluntboxApiService } from '../services/bluntbox-api.service';
import { UserPublic } from '../models/api.models';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const recipientResolver: ResolveFn<UserPublic | null> = (route, state) => {
    const api = inject(BluntboxApiService);
    const router = inject(Router);

    const username = route.paramMap.get('username');
    const slug = route.paramMap.get('slug');

    if (username) {
        return api.getUserByUsername(username).pipe(
            catchError(() => {
                router.navigate(['/not-found']);
                return of(null);
            })
        );
    }

    if (slug) {
        return api.getUserBySlug(slug).pipe(
            catchError(() => {
                router.navigate(['/not-found']);
                return of(null);
            })
        );
    }

    router.navigate(['/not-found']);
    return of(null);
};
