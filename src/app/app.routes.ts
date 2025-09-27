import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'auth/login',
    loadComponent: () => import('./modules/auth/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./modules/dashboard/components/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'accounts',
    loadComponent: () => import('./modules/accounts/components/accounts-list/accounts-list.component').then(m => m.AccountsListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'loans',
    loadComponent: () => import('./modules/loans/components/loans-list/loans-list.component').then(m => m.LoansListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'loans/apply',
    loadComponent: () => import('./modules/loans/components/loan-application/loan-application.component').then(m => m.LoanApplicationComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'loans/:id',
    loadComponent: () => import('./modules/loans/components/loan-detail/loan-detail.component').then(m => m.LoanDetailComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./modules/members/components/member-registration/member-registration.component').then(m => m.MemberRegistrationComponent)
  },
  {
    path: 'admin/members',
    loadComponent: () => import('./modules/members/components/admin-members/admin-members.component').then(m => m.AdminMembersComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'transactions',
    loadComponent: () => import('./modules/transactions/components/transactions-list/transactions-list.component').then(m => m.TransactionsListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'transactions/transfer',
    loadComponent: () => import('./modules/transactions/components/transfer/transfer.component').then(m => m.TransferComponent),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];
