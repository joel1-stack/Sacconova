export interface Loan {
  id: string;
  loanNumber: string;
  userId: string;
  productId: string;
  principalAmount: number;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  outstandingBalance: number;
  status: LoanStatus;
  applicationDate: Date;
  approvalDate?: Date;
  disbursementDate?: Date;
  guarantors: Guarantor[];
}

export enum LoanStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DISBURSED = 'disbursed',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  DEFAULTED = 'defaulted',
  REJECTED = 'rejected'
}

export interface LoanProduct {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  interestRate: number;
  maxTermMonths: number;
  requiresGuarantors: boolean;
  guarantorsRequired: number;
}

export interface Guarantor {
  id: string;
  userId: string;
  loanId: string;
  guaranteedAmount: number;
  status: GuarantorStatus;
  requestDate: Date;
  responseDate?: Date;
}

export enum GuarantorStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}