// stripe.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private API_URL = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  payment(token: string, amount: string) {
    return this.http.post(this.API_URL + '/payment/', { token, amount });
  }
}
