import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpErrorResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const TokenRefreshInterceptor: HttpInterceptorFn = (req, next) => {
  const authservice = inject(AuthService);
  const router = inject(Router);
  const httpClient = inject(HttpClient);

  if (req.url.includes('/login/refresh/')) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        const refreshToken = authservice.getRefreshToken();

        if (!refreshToken) {
          authservice.storeCurrentUrl();
          authservice.removeToken();
          router.navigate(['/login']);
          return throwError(() => error);
        }

        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null);

          return httpClient.post<any>(`${environment.apiUrl}/login/refresh/`, {
            refresh: refreshToken,
          }).pipe(
            switchMap((response) => {
              const newAccessToken = response.access;
              authservice.setAccessToken(newAccessToken);
              refreshTokenSubject.next(newAccessToken);
              isRefreshing = false;

              // Retry the original request with the new token
              const clonedRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newAccessToken}`,
                },
              });
              return next(clonedRequest);
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              authservice.storeCurrentUrl();
              authservice.removeToken();
              router.navigate(['/login']);
              return throwError(() => refreshError);
            })
          );
        } else {
          // Wait until the refresh completes, then retry
          return refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((newToken) => {
              const clonedRequest = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`,
                },
              });
              return next(clonedRequest);
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
};
