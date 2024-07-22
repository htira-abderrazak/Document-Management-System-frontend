import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

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
    private activatedRoute: ActivatedRoute
  ) {}

  storeCurrentUrl() {
    localStorage.setItem('previousUrl', this.router.url);
  }

  navigateTopreviousUrl() {
    if (this.router.url == localStorage.getItem('previousUrl')) {
      this.router.navigate(['/']);
    } else {
      if (localStorage.getItem('previousUrl'))
        this.router.navigate([localStorage.getItem('previousUrl')]);
      else this.router.navigate(['/']);
    }
  }
  getAccessToken() {
    return localStorage.getItem(this.access_token);
  }
  getRefreshToken(): string | null {
    return localStorage.getItem(this.refresh_token);
  }
  setAccessToken(access: string) {
    localStorage.setItem(this.access_token, access);
  }
  setToken(access: string, refresh: string): void {
    localStorage.setItem(this.access_token, access);
    localStorage.setItem(this.refresh_token, refresh);
  }

  removeToken(): void {
    localStorage.removeItem(this.access_token);
    localStorage.removeItem(this.refresh_token);
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

  register(username: string, email: string, password: string, token: string) {
    return this.http.post(this.API_URL + '/register/', {
      username: username,
      email: email,
      password: password,
      token: token,
    });
  }
}
