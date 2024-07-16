import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private access_token = 'access-token';
  private refresh_token = 'refresh-token';
  private API_URL = `${environment.apiUrl}`;
  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute : ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,

  ) {}

  storeCurrentUrl() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('previousUrl', this.router.url);
    }
  }

  navigateTopreviousUrl() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.router.url == localStorage.getItem('previousUrl')) {
        this.router.navigate(['/']);
      } else {
        if (localStorage.getItem('previousUrl'))
          this.router.navigate([localStorage.getItem('previousUrl')]);
        else this.router.navigate(['/']);
      }

    }
  }
  getAccessToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.access_token);
    }
    return null;
  }
  getRefreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.refresh_token);
    }
    return null;
  }
  setToken(access: string, refresh: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.access_token, access);
      localStorage.setItem(this.refresh_token, refresh);
    }
  }

  removeToken(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.access_token);
      localStorage.removeItem(this.refresh_token);
    }
  }

  isLoggedIn(): boolean {
    const access_token = this.getAccessToken();
    const refrech_token = this.getRefreshToken();
    return (
      refrech_token !== null &&
      refrech_token !== '' &&
      access_token !== null &&
      access_token !== ''
    );
  }

  login(name: string, pass: string) {
    const body = {
      username: name,
      password: pass,
    };
    return this.http.post(this.API_URL + '/login/', body);
  }

  logout() {
    return this.http.post(this.API_URL + '/logout/', {
      refresh_token: this.getRefreshToken(),
    });
  }

  register(
    username: string,
    email: string,
    password: string,
    token: string
  ) {
    return this.http.post(this.API_URL + '/register/', {
      username: username,
      email: email,
      password: password,
      token: token
    });
  }
}
