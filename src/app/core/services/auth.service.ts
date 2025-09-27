import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';
import { StoreService } from '../../store/store.service';
import { loginSuccess, loginFailure, logout } from '../../store/auth/auth.actions';
import { User } from '../models/user.model';
import { LoginResponse, ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private storageService: StorageService,
    private store: StoreService
  ) {
    this.loadUserFromStorage();
  }

  login(email: string, password: string): Observable<ApiResponse<LoginResponse>> {
    // Mock authentication - no backend needed
    const mockUser = {
      id: '1',
      email: email,
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+254715641339',
      memberNumber: 'MEM001',
      role: 'member' as any,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockResponse: ApiResponse<LoginResponse> = {
      success: true,
      message: 'Login successful',
      data: {
        user: mockUser,
        token: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now()
      }
    };

    // Simulate API delay
    return new Observable(observer => {
      setTimeout(() => {
        if (email === 'admin@sacconova.com' && password === 'admin123') {
          this.setCurrentUser(mockResponse.data!.user);
          this.storageService.setItem('token', mockResponse.data!.token);
          this.storageService.setItem('refreshToken', mockResponse.data!.refreshToken);
          this.store.dispatch(loginSuccess(mockResponse.data!.user, mockResponse.data!.token));
          observer.next(mockResponse);
        } else {
          this.store.dispatch(loginFailure('Invalid credentials'));
          observer.next({
            success: false,
            message: 'Invalid credentials',
            errors: ['Email or password is incorrect']
          });
        }
        observer.complete();
      }, 1000);
    });
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.storageService.removeItem('token');
    this.storageService.removeItem('refreshToken');
    this.storageService.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.storageService.getItem('token') && !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.storageService.setItem('user', JSON.stringify(user));
  }

  private loadUserFromStorage(): void {
    const userStr = this.storageService.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing user from storage:', error);
      }
    }
  }
}