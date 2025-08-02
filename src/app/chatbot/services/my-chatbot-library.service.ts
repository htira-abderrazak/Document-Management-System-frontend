import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, retry, delay, throwError, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { error } from 'console';
@Injectable({
  providedIn: 'root',
})
export class MyChatbotLibraryService {
  private API_URL = `${environment.apiUrl}`;
  private socket$!: WebSocketSubject<any>;
  private access_token = 'access-token';
  constructor(private router: Router) {}

  getAccessToken() {
    return localStorage.getItem(this.access_token);
  }

  private getSocket(): WebSocketSubject<any> {
    if (this.socket$ && !this.socket$.closed) {
      return this.socket$;
    }
    const url = this.API_URL + `/chat/?token=${this.getAccessToken()}`;
    this.socket$ = webSocket({ url });
    return this.socket$;
  }

  //Connect to the Ai management with websockets
  public connect(): Observable<any> {
    const token = this.getAccessToken();
    const expiredOrErr = this.tokenExpired(token!);
    if (expiredOrErr instanceof Error) {
      return throwError(() => expiredOrErr);
    }
    if (expiredOrErr) {
      return throwError(() => new Error('Token expired'));
    }

    return this.getSocket().pipe(
      retry({ delay: 2000 }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
  send(message: any): void {
    this.socket$.next(message);
  }

  onMessage(): Observable<any> {
    return this.socket$.asObservable();
  }

  disconnect(): void {
    this.socket$.complete();
  }

  isConnected(): boolean {
    return !!this.socket$ && !this.socket$.closed;
  }
  tokenExpired(token: string) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      return now >= exp;
    } catch (error) {
      return [false, error as Error];
    }
  }
}
