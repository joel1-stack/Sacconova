import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { WebSocketService } from '../../../../core/services/websocket.service';
import { AnalyticsService } from '../../../../core/services/analytics.service';
import { TranslationService } from '../../../../core/services/translation.service';
import { PrivacyService, PrivacySettings } from '../../../../core/services/privacy.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { DashboardStats } from '../../../../core/models/api-response.model';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent, LoadingSpinnerComponent],
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.scss']
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  stats: DashboardStats = {
    totalMembers: 1250,
    totalSavings: 2500000,
    totalLoans: 1800000,
    totalShares: 500000,
    pendingLoans: 15,
    activeLoans: 85
  };
  
  isLoading = false;
  realTimeUpdates: any[] = [];
  unreadNotifications = 3;
  transactionSearch = '';
  recentTransactions: any[] = [];
  privacySettings: PrivacySettings = {
    showBalances: true,
    showTransactions: true,
    showLoanDetails: true,
    showPersonalInfo: true,
    requirePinForActions: false
  };
  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private websocketService: WebSocketService,
    private analyticsService: AnalyticsService,
    private translationService: TranslationService,
    private privacyService: PrivacyService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.setupRealTimeUpdates();
    this.loadRecentTransactions();
    this.loadPrivacySettings();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  private setupRealTimeUpdates(): void {
    // Mock real-time updates for demo
    setInterval(() => {
      const mockUpdate = {
        type: 'balance_update',
        message: 'Account balance updated',
        amount: Math.floor(Math.random() * 10000),
        timestamp: new Date()
      };
      this.realTimeUpdates.unshift(mockUpdate);
      this.realTimeUpdates = this.realTimeUpdates.slice(0, 10);
    }, 30000); // Update every 30 seconds
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  private loadRecentTransactions(): void {
    this.recentTransactions = [
      {
        id: '1',
        type: 'deposit',
        description: 'Monthly Savings Deposit',
        amount: 10000,
        date: new Date(),
        reference: 'TXN001',
        status: 'completed'
      },
      {
        id: '2',
        type: 'withdrawal',
        description: 'ATM Withdrawal',
        amount: -5000,
        date: new Date(Date.now() - 86400000),
        reference: 'TXN002',
        status: 'completed'
      },
      {
        id: '3',
        type: 'loan',
        description: 'Loan Payment',
        amount: -8884,
        date: new Date(Date.now() - 172800000),
        reference: 'TXN003',
        status: 'completed'
      }
    ];
  }

  getTransactionIcon(type: string): string {
    switch (type) {
      case 'deposit': return '💰';
      case 'withdrawal': return '💸';
      case 'loan': return '🏦';
      default: return '💳';
    }
  }

  toggleNotifications(): void {
    this.unreadNotifications = 0;
    this.notificationService.showSuccess('Notifications cleared');
  }

  private loadPrivacySettings(): void {
    this.subscriptions.add(
      this.privacyService.privacySettings$.subscribe(settings => {
        this.privacySettings = settings;
      })
    );
  }

  toggleBalanceVisibility(): void {
    this.privacyService.toggleBalanceVisibility();
    const message = this.privacySettings.showBalances ? 'Balances hidden' : 'Balances shown';
    this.notificationService.showSuccess(message);
  }

  refreshBalances(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.notificationService.showSuccess('Balances refreshed successfully');
    }, 2000);
  }

  exportStatements(): void {
    this.notificationService.showSuccess('Statements exported successfully');
    // Mock file download
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,Mock Statement Data';
    link.download = 'sacco-statement.txt';
    link.click();
  }

  quickTransfer(): void {
    if (this.privacySettings.requirePinForActions) {
      this.requestPinVerification(() => this.navigateToTransfer());
    } else {
      this.navigateToTransfer();
    }
  }

  applyLoan(): void {
    if (this.privacySettings.requirePinForActions) {
      this.requestPinVerification(() => this.navigateToLoanApplication());
    } else {
      this.navigateToLoanApplication();
    }
  }

  mobileMoneyDeposit(): void {
    if (this.privacySettings.requirePinForActions) {
      this.requestPinVerification(() => this.processMpesaDeposit());
    } else {
      this.processMpesaDeposit();
    }
  }

  mobileMoneyWithdraw(): void {
    if (this.privacySettings.requirePinForActions) {
      this.requestPinVerification(() => this.processMpesaWithdraw());
    } else {
      this.processMpesaWithdraw();
    }
  }

  private navigateToTransfer(): void {
    this.router.navigate(['/transactions/transfer']);
  }

  private navigateToLoanApplication(): void {
    this.router.navigate(['/loans/apply']);
  }

  private processMpesaDeposit(): void {
    const phoneNumber = prompt('Enter M-Pesa phone number:');
    const amount = prompt('Enter amount to deposit:');
    if (phoneNumber && amount) {
      this.notificationService.showSuccess(`M-Pesa deposit of KES ${amount} initiated to ${phoneNumber}`);
    }
  }

  private processMpesaWithdraw(): void {
    const phoneNumber = prompt('Enter M-Pesa phone number:');
    const amount = prompt('Enter amount to withdraw:');
    if (phoneNumber && amount) {
      this.notificationService.showSuccess(`M-Pesa withdrawal of KES ${amount} initiated to ${phoneNumber}`);
    }
  }

  private requestPinVerification(callback: () => void): void {
    const pin = prompt('Enter your PIN to continue:');
    if (pin === '1234') { // Mock PIN verification
      callback();
    } else if (pin) {
      this.notificationService.show('error', 'Invalid PIN. Please try again.');
    }
  }

  getDisplayValue(value: number, type: 'balance' | 'transaction'): string {
    if (type === 'balance' && !this.privacySettings.showBalances) {
      return '****';
    }
    if (type === 'transaction' && !this.privacySettings.showTransactions) {
      return '****';
    }
    return value.toString();
  }
}