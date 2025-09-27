import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { Account, AccountType } from '../../../../core/models/account.model';

@Component({
  selector: 'app-accounts-list',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoadingSpinnerComponent],
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss']
})
export class AccountsListComponent implements OnInit {
  accounts: Account[] = [
    {
      id: '1',
      accountNumber: 'SAV001',
      accountType: AccountType.SAVINGS,
      balance: 150000,
      userId: '1',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      accountNumber: 'SHR001',
      accountType: AccountType.SHARES,
      balance: 50000,
      userId: '1',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];
  
  isLoading = false;

  ngOnInit(): void {
    // Load accounts data
  }

  getAccountTypeLabel(type: AccountType): string {
    switch (type) {
      case AccountType.SAVINGS: return 'Savings';
      case AccountType.SHARES: return 'Shares';
      case AccountType.LOAN: return 'Loan';
      default: return type;
    }
  }
}