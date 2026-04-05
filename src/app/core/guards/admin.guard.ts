import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Admin Guard — protects admin routes.
 * Redirects to home if not admin, or to login if not authenticated.
 */
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  if (!authService.isAdmin()) {
    // Access denied — redirect to home
    router.navigate(['/']);
    return false;
  }

  return true;
};
