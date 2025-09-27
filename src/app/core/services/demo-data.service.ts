import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DemoDataService {
  
  getDashboardStats(): Observable<any> {
    return of({
      totalMembers: 1250,
      totalSavings: 2500000,
      totalLoans: 1800000,
      totalShares: 500000,
      pendingLoans: 15,
      activeLoans: 85
    }).pipe(delay(500));
  }

  getAccounts(): Observable<any[]> {
    return of([
      {
        id: '1',
        accountNumber: 'SAV001',
        accountType: 'savings',
        balance: 150000,
        userId: '1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        accountNumber: 'SHR001',
        accountType: 'shares',
        balance: 50000,
        userId: '1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]).pipe(delay(500));
  }

  getLoans(): Observable<any[]> {
    return of([
      {
        id: '1',
        loanNumber: 'LN001',
        userId: '1',
        productId: '1',
        principalAmount: 100000,
        interestRate: 12,
        termMonths: 12,
        monthlyPayment: 8884,
        outstandingBalance: 75000,
        status: 'active',
        applicationDate: new Date('2024-01-15'),
        approvalDate: new Date('2024-01-20'),
        disbursementDate: new Date('2024-01-25'),
        guarantors: []
      }
    ]).pipe(delay(500));
  }

  getTransactions(): Observable<any[]> {
    return of([
      {
        id: '1',
        accountId: '1',
        type: 'deposit',
        amount: 10000,
        description: 'Monthly Savings',
        reference: 'TXN001',
        createdAt: new Date()
      },
      {
        id: '2',
        accountId: '1',
        type: 'withdrawal',
        amount: 5000,
        description: 'ATM Withdrawal',
        reference: 'TXN002',
        createdAt: new Date()
      }
    ]).pipe(delay(500));
  }
}