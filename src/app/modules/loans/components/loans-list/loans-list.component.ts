import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { Loan, LoanStatus } from '../../../../core/models/loan.model';

@Component({
  selector: 'app-loans-list',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoadingSpinnerComponent],
  templateUrl: './loans-list.component.html',
  styleUrls: ['./loans-list.component.scss']
})
export class LoansListComponent implements OnInit {
  constructor(public router: Router) {}
  
  loans: Loan[] = [
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
      status: LoanStatus.ACTIVE,
      applicationDate: new Date('2024-01-15'),
      approvalDate: new Date('2024-01-20'),
      disbursementDate: new Date('2024-01-25'),
      guarantors: []
    }
  ];
  
  isLoading = false;

  ngOnInit(): void {
    this.loadLoans();
  }

  loadLoans(): void {
    // Load from localStorage (demo data)
    const storedLoans = JSON.parse(localStorage.getItem('loanApplications') || '[]');
    this.loans = [...this.loans, ...storedLoans];
  }

  navigateToApplication(): void {
    this.router.navigate(['/loans/apply']);
  }

  viewLoanDetails(loanId: string): void {
    this.router.navigate(['/loans', loanId]);
  }

  getStatusClass(status: LoanStatus): string {
    switch (status) {
      case LoanStatus.ACTIVE: return 'status-active';
      case LoanStatus.PENDING: return 'status-pending';
      case LoanStatus.COMPLETED: return 'status-completed';
      case LoanStatus.DEFAULTED: return 'status-defaulted';
      default: return 'status-default';
    }
  }

  getStatusLabel(status: LoanStatus): string {
    switch (status) {
      case LoanStatus.ACTIVE: return 'Active';
      case LoanStatus.PENDING: return 'Pending';
      case LoanStatus.COMPLETED: return 'Completed';
      case LoanStatus.DEFAULTED: return 'Defaulted';
      default: return status;
    }
  }
}