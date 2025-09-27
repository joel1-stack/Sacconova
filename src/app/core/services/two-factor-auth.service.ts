import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export interface TwoFactorRequest {
  userId: string;
  method: 'sms' | 'email';
  phoneNumber?: string;
  email?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TwoFactorAuthService {
  private pendingVerification = new BehaviorSubject<boolean>(false);

  sendVerificationCode(request: TwoFactorRequest): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      // Mock implementation
      setTimeout(() => {
        this.pendingVerification.next(true);
        observer.next({
          success: true,
          message: `Verification code sent to ${request.method === 'sms' ? request.phoneNumber : request.email}`
        });
        observer.complete();
      }, 1500);
    });
  }

  verifyCode(code: string): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        const isValid = code === '123456'; // Mock validation
        this.pendingVerification.next(!isValid);
        observer.next({
          success: isValid,
          message: isValid ? 'Verification successful' : 'Invalid verification code'
        });
        observer.complete();
      }, 1000);
    });
  }

  isPendingVerification(): Observable<boolean> {
    return this.pendingVerification.asObservable();
  }

  generateQRCode(userId: string): Observable<string> {
    // Mock QR code generation for authenticator apps
    return new Observable(observer => {
      const qrData = `otpauth://totp/SaccoNova:${userId}?secret=JBSWY3DPEHPK3PXP&issuer=SaccoNova`;
      observer.next(qrData);
      observer.complete();
    });
  }
}