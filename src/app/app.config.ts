import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { provideAnimations } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { TokenRefreshInterceptor } from './auth/TokenRefreshInterceptor/token-refresh-interceptor.interceptor';
import { authInterceptor } from './auth/AuthInterceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, TokenRefreshInterceptor])),
    // provideHttpClient(withFetch(),withInterceptors([authInterceptor])),

    NgbActiveModal,
    provideAnimations(),
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.recaptcha.siteKey },
  ],
};
