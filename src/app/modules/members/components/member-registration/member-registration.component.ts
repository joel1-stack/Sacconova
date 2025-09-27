import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-member-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './member-registration.component.html',
  styleUrls: ['./member-registration.component.scss']
})
export class MemberRegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  isLoading = false;
  isSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registrationForm = this.fb.group({
      // Personal Information
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      nationalId: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      
      // Contact Information
      phoneNumber: ['', [Validators.required, Validators.pattern(/^254\d{9}$/)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      
      // Employment Information
      occupation: ['', Validators.required],
      employer: ['', Validators.required],
      monthlyIncome: ['', [Validators.required, Validators.min(10000)]],
      
      // Next of Kin
      nextOfKinName: ['', Validators.required],
      nextOfKinPhone: ['', [Validators.required, Validators.pattern(/^254\d{9}$/)]],
      nextOfKinRelationship: ['', Validators.required],
      
      // Account Preferences
      initialDeposit: ['', [Validators.required, Validators.min(1000)]],
      
      // Terms and Conditions
      agreeToTerms: [false, Validators.requiredTrue],
      agreeToPrivacy: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (this.registrationForm.valid) {
      this.isLoading = true;
      
      const memberData = {
        ...this.registrationForm.value,
        applicationDate: new Date(),
        status: 'pending',
        memberId: 'MEM' + Date.now(),
        applicationId: 'APP' + Date.now()
      };

      // Save to localStorage (simulate API call)
      setTimeout(() => {
        const existingApplications = JSON.parse(localStorage.getItem('memberApplications') || '[]');
        existingApplications.push(memberData);
        localStorage.setItem('memberApplications', JSON.stringify(existingApplications));
        
        this.isLoading = false;
        this.isSubmitted = true;
        this.notificationService.showSuccess('Application submitted successfully! You will be notified once approved.');
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registrationForm.controls).forEach(key => {
      this.registrationForm.get(key)?.markAsTouched();
    });
  }

  formatPhoneNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.startsWith('0')) {
      value = '254' + value.substring(1);
    }
    if (!value.startsWith('254')) {
      value = '254' + value;
    }
    this.registrationForm.patchValue({ phoneNumber: value });
  }

  formatNextOfKinPhone(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.startsWith('0')) {
      value = '254' + value.substring(1);
    }
    if (!value.startsWith('254')) {
      value = '254' + value;
    }
    this.registrationForm.patchValue({ nextOfKinPhone: value });
  }

  goToLogin(): void {
    this.router.navigate(['/']);
  }
}