import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authservice = inject(AuthService);
  const router = inject(Router);
  const httpClient = inject(HttpClient);

  if ((req.url === `${environment.apiUrl}/login/` )||(req.url === `${environment.apiUrl}/login/refresh/` )||(req.url === `${environment.apiUrl}/register/` ) ) {
    return next(req);
  }
  let authReq = req;

  // Check if the platform is a browser
  const accessToken = authservice.getAccessToken();
  const refreshToken = authservice.getRefreshToken();

  if (accessToken && refreshToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (refreshToken) {
          return httpClient
            .post(`${environment.apiUrl}/login/refresh/`, {
              refresh: refreshToken,
            })
            .pipe(
              switchMap((response: any) => {
                authservice.setToken(response.access, response.refesh);
                // Clone the original request with the new token
                const clonedRequest = authReq.clone({
                  setHeaders: {
                    Authorization: `Bearer ${response.access}`,
                  },
                });

                return next(clonedRequest);
              }),
              catchError((refreshError) => {
                if (refreshError.status === 401) {
                  authservice.storeCurrentUrl();
                  authservice.removeToken();
                  router.navigate(['/login']);
                }
                return throwError(() => refreshError);
              })
            );
        } else {
          authservice.storeCurrentUrl();
          authservice.removeToken();
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};
