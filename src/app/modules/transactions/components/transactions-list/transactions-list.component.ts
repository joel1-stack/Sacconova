import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { Transaction, TransactionType } from '../../../../core/models/account.model';

@Component({
  selector: 'app-transactions-list',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoadingSpinnerComponent],
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.scss']
})
export class TransactionsListComponent implements OnInit {
  transactions: Transaction[] = [
    {
      id: '1',
      accountId: '1',
      type: TransactionType.DEPOSIT,
      amount: 10000,
      description: 'Monthly Savings',
      reference: 'TXN001',
      createdAt: new Date()
    },
    {
      id: '2',
      accountId: '1',
      type: TransactionType.WITHDRAWAL,
      amount: 5000,
      description: 'ATM Withdrawal',
      reference: 'TXN002',
      createdAt: new Date()
    }
  ];
  
  isLoading = false;

  ngOnInit(): void {
    // Load transactions data
  }

  getTransactionTypeClass(type: TransactionType): string {
    switch (type) {
      case TransactionType.DEPOSIT: return 'type-deposit';
      case TransactionType.WITHDRAWAL: return 'type-withdrawal';
      case TransactionType.TRANSFER: return 'type-transfer';
      case TransactionType.LOAN_DISBURSEMENT: return 'type-loan';
      case TransactionType.LOAN_REPAYMENT: return 'type-repayment';
      default: return 'type-default';
    }
  }

  getTransactionTypeLabel(type: TransactionType): string {
    switch (type) {
      case TransactionType.DEPOSIT: return 'Deposit';
      case TransactionType.WITHDRAWAL: return 'Withdrawal';
      case TransactionType.TRANSFER: return 'Transfer';
      case TransactionType.LOAN_DISBURSEMENT: return 'Loan Disbursement';
      case TransactionType.LOAN_REPAYMENT: return 'Loan Repayment';
      default: return type;
    }
  }

  getAmountClass(type: TransactionType): string {
    return type === TransactionType.DEPOSIT || type === TransactionType.LOAN_DISBURSEMENT 
      ? 'amount-positive' : 'amount-negative';
  }
}