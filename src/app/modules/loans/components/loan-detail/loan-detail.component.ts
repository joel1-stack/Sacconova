import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-loan-detail',
  standalone: true,
  imports: [CommonModule, HeaderComponent, LoadingSpinnerComponent],
  templateUrl: './loan-detail.component.html',
  styleUrls: ['./loan-detail.component.scss']
})
export class LoanDetailComponent implements OnInit {
  loan: any = null;
  paymentHistory: any[] = [];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    const loanId = this.route.snapshot.params['id'];
    this.loadLoanDetails(loanId);
  }

  loadLoanDetails(loanId: string): void {
    this.isLoading = true;
    
    // Load from localStorage
    const storedLoans = JSON.parse(localStorage.getItem('loanApplications') || '[]');
    this.loan = storedLoans.find((l: any) => l.id === loanId);
    
    if (this.loan) {
      this.generatePaymentHistory();
    }
    
    this.isLoading = false;
  }

  generatePaymentHistory(): void {
    if (!this.loan?.paymentSchedule) return;
    
    // Generate mock payment history
    this.paymentHistory = this.loan.paymentSchedule.slice(0, 3).map((payment: any, index: number) => ({
      ...payment,
      paidDate: new Date(Date.now() - ((3 - index) * 30 * 24 * 60 * 60 * 1000)),
      status: 'paid',
      transactionRef: 'TXN' + (Date.now() + index)
    }));
  }

  makePayment(payment: any): void {
    // Simulate payment
    const newPayment = {
      ...payment,
      paidDate: new Date(),
      status: 'paid',
      transactionRef: 'TXN' + Date.now()
    };
    
    this.paymentHistory.push(newPayment);
    
    // Update loan balance
    this.loan.outstandingBalance -= payment.principal;
    
    // Store updated loan
    const storedLoans = JSON.parse(localStorage.getItem('loanApplications') || '[]');
    const loanIndex = storedLoans.findIndex((l: any) => l.id === this.loan.id);
    if (loanIndex !== -1) {
      storedLoans[loanIndex] = this.loan;
      localStorage.setItem('loanApplications', JSON.stringify(storedLoans));
    }
  }

  getNextPayment() {
    if (!this.loan?.paymentSchedule) return null;
    return this.loan.paymentSchedule.find((p: any) => 
      !this.paymentHistory.some(ph => ph.month === p.month)
    );
  }

  isPaymentPaid(payment: any): boolean {
    return this.paymentHistory.some(p => p.month === payment.month);
  }

  getPaymentStatus(payment: any): string {
    return this.isPaymentPaid(payment) ? 'Paid' : 'Pending';
  }
}