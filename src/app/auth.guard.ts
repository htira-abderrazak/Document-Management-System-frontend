import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const authservice = inject(AuthService);
  if (authservice.isLoggedIn()) {

    return true;
  } else {

    router.navigate(['/login']);
    return false;
  }

};
