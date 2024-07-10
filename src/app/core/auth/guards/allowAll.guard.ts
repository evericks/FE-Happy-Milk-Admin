import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { of, switchMap } from 'rxjs';

export const AllowAllGuard: CanActivateFn | CanActivateChildFn = (
    route,
    state
) => {
    // Check the authentication status
    return inject(AuthService)
        .check()
        .pipe(
            switchMap(() => {
                // Allow the access
                return of(true);
            })
        );
};
