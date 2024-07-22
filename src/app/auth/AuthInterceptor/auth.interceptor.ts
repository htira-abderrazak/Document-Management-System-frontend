import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authservice = inject(AuthService);
  const access_token = authservice.getAccessToken();

  if (
    req.url === `${environment.apiUrl}/login/` ||
    req.url === `${environment.apiUrl}/login/refresh/` ||
    req.url === `${environment.apiUrl}/register/`
  ) {
    return next(req);
  }

  if (access_token) {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return next(modifiedReq);
  }
      return next(req);



};
