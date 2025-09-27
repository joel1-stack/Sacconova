import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="transfer-container">
      <div class="transfer-form">
        <h2>💸 Quick Transfer</h2>
        <form (ngSubmit)="processTransfer()">
          <div class="form-group">
            <label>Recipient Account</label>
            <input type="text" [(ngModel)]="recipientAccount" name="recipient" required>
          </div>
          <div class="form-group">
            <label>Amount (KES)</label>
            <input type="number" [(ngModel)]="amount" name="amount" required>
          </div>
          <div class="form-group">
            <label>Description</label>
            <input type="text" [(ngModel)]="description" name="description">
          </div>
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">Transfer</button>
            <button type="button" class="btn btn-secondary" (click)="goBack()">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .transfer-container {
      padding: 2rem;
      max-width: 600px;
      margin: 0 auto;
    }
    .transfer-form {
      background: #f1f5f9;
      padding: 2rem;
      border-radius: 16px;
      box-shadow: 0 8px 25px rgba(26, 58, 95, 0.12);
    }
    h2 {
      color: #1a3a5f;
      margin-bottom: 2rem;
    }
    .form-group {
      margin-bottom: 1.5rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #374151;
      font-weight: 600;
    }
    input {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #64748b;
      border-radius: 8px;
      font-size: 1rem;
    }
    input:focus {
      outline: none;
      border-color: #4169e1;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }
    .btn-primary {
      background: linear-gradient(135deg, #1a3a5f, #4169e1);
      color: white;
    }
    .btn-secondary {
      background: #64748b;
      color: white;
    }
  `]
})
export class TransferComponent {
  recipientAccount = '';
  amount = 0;
  description = '';

  constructor(
    private router: Router,
    private notificationService: NotificationService
  ) {}

  processTransfer(): void {
    if (this.recipientAccount && this.amount > 0) {
      this.notificationService.showSuccess(`Transfer of KES ${this.amount} to ${this.recipientAccount} completed successfully`);
      this.router.navigate(['/dashboard']);
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}