import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { LOAN_PRODUCTS } from '../../../../shared/utils/constants';

@Component({
  selector: 'app-loan-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, LoadingSpinnerComponent],
  templateUrl: './loan-application.component.html',
  styleUrls: ['./loan-application.component.scss']
})
export class LoanApplicationComponent implements OnInit {
  loanForm: FormGroup;
  isLoading = false;
  loanProducts = LOAN_PRODUCTS;
  calculatedPayment = 0;
  paymentSchedule: any[] = [];

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private notificationService: NotificationService
  ) {
    this.loanForm = this.fb.group({
      productId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(10000)]],
      termMonths: ['', [Validators.required, Validators.min(6), Validators.max(60)]],
      purpose: ['', Validators.required],
      nationalId: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      monthlyIncome: ['', [Validators.required, Validators.min(20000)]],
      guarantor1Name: ['', Validators.required],
      guarantor1Phone: ['', Validators.required],
      guarantor2Name: [''],
      guarantor2Phone: ['']
    });
  }

  ngOnInit(): void {
    this.loanForm.valueChanges.subscribe(() => {
      this.calculatePayment();
    });
  }

  calculatePayment(): void {
    const amount = this.loanForm.get('amount')?.value;
    const termMonths = this.loanForm.get('termMonths')?.value;
    const productId = this.loanForm.get('productId')?.value;

    if (amount && termMonths && productId) {
      const product = this.loanProducts.find(p => p.id === productId);
      if (product) {
        const monthlyRate = product.interestRate / 100 / 12;
        const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
                       (Math.pow(1 + monthlyRate, termMonths) - 1);
        this.calculatedPayment = Math.round(payment);
        this.generatePaymentSchedule();
      }
    }
  }

  generatePaymentSchedule(): void {
    const amount = this.loanForm.get('amount')?.value;
    const termMonths = this.loanForm.get('termMonths')?.value;
    
    if (!amount || !termMonths || !this.calculatedPayment) return;

    this.paymentSchedule = [];
    let balance = amount;
    const productId = this.loanForm.get('productId')?.value;
    const product = this.loanProducts.find(p => p.id === productId);
    const monthlyRate = product ? product.interestRate / 100 / 12 : 0.01;

    for (let i = 1; i <= termMonths; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = this.calculatedPayment - interestPayment;
      balance -= principalPayment;

      this.paymentSchedule.push({
        month: i,
        payment: this.calculatedPayment,
        principal: Math.round(principalPayment),
        interest: Math.round(interestPayment),
        balance: Math.round(Math.max(0, balance)),
        dueDate: new Date(Date.now() + (i * 30 * 24 * 60 * 60 * 1000))
      });
    }
  }

  onSubmit(): void {
    if (this.loanForm.valid) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        const loanApplication = {
          id: 'LN' + Date.now(),
          ...this.loanForm.value,
          calculatedPayment: this.calculatedPayment,
          paymentSchedule: this.paymentSchedule,
          applicationDate: new Date(),
          status: 'pending',
          userId: '1'
        };

        // Store in localStorage for demo
        const existingLoans = JSON.parse(localStorage.getItem('loanApplications') || '[]');
        existingLoans.push(loanApplication);
        localStorage.setItem('loanApplications', JSON.stringify(existingLoans));

        this.isLoading = false;
        this.notificationService.success('Loan application submitted successfully!');
        this.router.navigate(['/loans']);
      }, 2000);
    } else {
      this.notificationService.error('Please fill all required fields correctly.');
    }
  }

  getSelectedProduct() {
    const productId = this.loanForm.get('productId')?.value;
    return this.loanProducts.find(p => p.id === productId);
  }
}