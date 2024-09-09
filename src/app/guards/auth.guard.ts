import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';

export const authGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const jwtHelper = inject(JwtHelperService);
  const router = inject(Router);

  const token = cookieService.get('token');

  if (token) {
    // Decode the token to check its validity and role
    const decodedToken = jwtHelper.decodeToken(token);
    const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (role) {
      // Check if the route's data role matches the user's role
      if (route.data['role'] && route.data['role'].includes(role)) {
        return true; // Allow the route if the role matches
      } else {
        // Redirect to the appropriate dashboard if roles don't match
        if (role === 'Admin') {
          router.navigate(['/admin-dashboard']);
        } else if (role === 'User') {
          router.navigate(['/user-dashboard']);
        }
        return false;
      }
    }
  }

  // If no token or role found, redirect to login
  router.navigate(['/login']);
  return false;
};
