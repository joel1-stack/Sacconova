import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';
import { NotificationService } from '../../../../core/services/notification.service';

export interface MemberApplication {
  applicationId: string;
  memberId: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  email: string;
  phoneNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  applicationDate: Date;
  reviewDate?: Date;
  reviewedBy?: string;
  initialDeposit: number;
  monthlyIncome: number;
  occupation: string;
  employer: string;
}

@Component({
  selector: 'app-admin-members',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, LoadingSpinnerComponent],
  templateUrl: './admin-members.component.html',
  styleUrls: ['./admin-members.component.scss']
})
export class AdminMembersComponent implements OnInit {
  applications: MemberApplication[] = [];
  filteredApplications: MemberApplication[] = [];
  isLoading = false;
  selectedApplication: MemberApplication | null = null;
  showModal = false;
  
  // Filters
  statusFilter = 'all';
  searchTerm = '';
  
  // Stats
  stats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  };

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    
    // Load from localStorage
    setTimeout(() => {
      const storedApplications = JSON.parse(localStorage.getItem('memberApplications') || '[]');
      this.applications = storedApplications.map((app: any) => ({
        ...app,
        applicationDate: new Date(app.applicationDate),
        reviewDate: app.reviewDate ? new Date(app.reviewDate) : undefined
      }));
      
      this.updateStats();
      this.applyFilters();
      this.isLoading = false;
    }, 1000);
  }

  updateStats(): void {
    this.stats.total = this.applications.length;
    this.stats.pending = this.applications.filter(app => app.status === 'pending').length;
    this.stats.approved = this.applications.filter(app => app.status === 'approved').length;
    this.stats.rejected = this.applications.filter(app => app.status === 'rejected').length;
  }

  applyFilters(): void {
    let filtered = [...this.applications];

    // Status filter
    if (this.statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === this.statusFilter);
    }

    // Search filter
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.firstName.toLowerCase().includes(term) ||
        app.lastName.toLowerCase().includes(term) ||
        app.email.toLowerCase().includes(term) ||
        app.nationalId.includes(term) ||
        app.memberId.toLowerCase().includes(term)
      );
    }

    this.filteredApplications = filtered.sort((a, b) => 
      new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()
    );
  }

  onStatusFilterChange(): void {
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  viewApplication(application: MemberApplication): void {
    this.selectedApplication = application;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedApplication = null;
  }

  approveApplication(application: MemberApplication): void {
    if (confirm(`Approve membership application for ${application.firstName} ${application.lastName}?`)) {
      this.updateApplicationStatus(application, 'approved');
      
      // Create member account
      this.createMemberAccount(application);
      
      this.notificationService.showSuccess(`Application approved for ${application.firstName} ${application.lastName}`);
    }
  }

  rejectApplication(application: MemberApplication): void {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      this.updateApplicationStatus(application, 'rejected');
      this.notificationService.showSuccess(`Application rejected for ${application.firstName} ${application.lastName}`);
    }
  }

  private updateApplicationStatus(application: MemberApplication, status: 'approved' | 'rejected'): void {
    const index = this.applications.findIndex(app => app.applicationId === application.applicationId);
    if (index !== -1) {
      this.applications[index].status = status;
      this.applications[index].reviewDate = new Date();
      this.applications[index].reviewedBy = 'Admin'; // In real app, get from auth service
      
      // Update localStorage
      localStorage.setItem('memberApplications', JSON.stringify(this.applications));
      
      this.updateStats();
      this.applyFilters();
      this.closeModal();
    }
  }

  private createMemberAccount(application: MemberApplication): void {
    // Create member account in the system
    const memberAccount = {
      memberId: application.memberId,
      firstName: application.firstName,
      lastName: application.lastName,
      email: application.email,
      phoneNumber: application.phoneNumber,
      nationalId: application.nationalId,
      joinDate: new Date(),
      status: 'active',
      accounts: [
        {
          accountNumber: 'SAV' + Date.now(),
          accountType: 'savings',
          balance: application.initialDeposit,
          openDate: new Date()
        }
      ]
    };

    // Store member account
    const existingMembers = JSON.parse(localStorage.getItem('members') || '[]');
    existingMembers.push(memberAccount);
    localStorage.setItem('members', JSON.stringify(existingMembers));

    // Send welcome email/SMS (mock)
    console.log(`Welcome email sent to ${application.email}`);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  }

  exportApplications(): void {
    // Mock export functionality
    const csvData = this.filteredApplications.map(app => ({
      'Application ID': app.applicationId,
      'Member ID': app.memberId,
      'Name': `${app.firstName} ${app.lastName}`,
      'Email': app.email,
      'Phone': app.phoneNumber,
      'Status': app.status,
      'Application Date': app.applicationDate.toLocaleDateString(),
      'Initial Deposit': app.initialDeposit
    }));

    console.log('Exporting applications:', csvData);
    this.notificationService.showSuccess('Applications exported successfully');
  }
}