import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import {  throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

export const TokenRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authservice = inject(AuthService);
  const router = inject(Router);
  const httpClient = inject(HttpClient);

  if (req.url === `${environment.apiUrl}/login/refresh/`) return next(req);

  const refreshToken = authservice.getRefreshToken();

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (refreshToken) {
          return httpClient
            .post(`${environment.apiUrl}/login/refresh/`, {
              refresh: refreshToken,
            })
            .pipe(
              switchMap((response: any) => {
                authservice.setAccessToken(response.access);
                // Clone the original request with the new token
                const clonedRequest = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${response.access}`,
                  },
                });

                return next(clonedRequest);
              }),
              catchError((refreshError) => {
                if (refreshError.status === 401) {
                  console.log("test1")
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
