import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';

export const signGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authservice = inject(AuthService);
  if (authservice.isLoggedIn()) {
    router.navigate(['mydrive']);

    return false;
  } else {
    return true;
  }
};
