import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MpesaSTKRequest {
  phoneNumber: string;
  amount: number;
  accountReference: string;
  transactionDesc: string;
}

export interface MpesaResponse {
  success: boolean;
  checkoutRequestID?: string;
  responseCode?: string;
  responseDescription?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MpesaService {
  private baseUrl = 'https://api.safaricom.co.ke';

  constructor(private http: HttpClient) {}

  initiateSTKPush(request: MpesaSTKRequest): Observable<MpesaResponse> {
    // Mock implementation for demo
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          success: true,
          checkoutRequestID: 'ws_CO_' + Date.now(),
          responseCode: '0',
          responseDescription: 'Success. Request accepted for processing'
        });
        observer.complete();
      }, 2000);
    });
  }

  querySTKStatus(checkoutRequestID: string): Observable<any> {
    // Mock implementation
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          resultCode: '0',
          resultDesc: 'The service request is processed successfully.',
          amount: 1000,
          mpesaReceiptNumber: 'NLJ7RT61SV'
        });
        observer.complete();
      }, 1000);
    });
  }

  formatPhoneNumber(phone: string): string {
    // Convert to 254 format
    if (phone.startsWith('0')) {
      return '254' + phone.substring(1);
    }
    if (phone.startsWith('+254')) {
      return phone.substring(1);
    }
    return phone;
  }
}