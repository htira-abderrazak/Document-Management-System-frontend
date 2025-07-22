import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, retry, delay } from 'rxjs';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class MyChatbotLibraryService {
  private API_URL = `${environment.apiUrl}`;
  private socket$!: WebSocketSubject<any>;
  private access_token = 'access-token';
  constructor() {}

  getAccessToken() {
    return localStorage.getItem(this.access_token);
  }
  //Connect to the Ai management with websockets
  connect() {
    const url = this.API_URL + `/chat/?token=${this.getAccessToken()}`;
    this.socket$ = webSocket({ url });
    // Optional: reconnect on errors
    this.socket$.pipe(retry({ delay: 2000 })).subscribe({
      next: () => {},
      error: (err) => console.error('WebSocket error', err),
      complete: () => console.log('WebSocket closed'),
    });
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
}
