export interface Account {
  id: string;
  accountNumber: string;
  accountType: AccountType;
  balance: number;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum AccountType {
  SAVINGS = 'savings',
  SHARES = 'shares',
  LOAN = 'loan'
}

export interface AccountStatement {
  accountId: string;
  transactions: Transaction[];
  openingBalance: number;
  closingBalance: number;
  period: {
    from: Date;
    to: Date;
  };
}

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  description: string;
  reference: string;
  createdAt: Date;
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
  LOAN_DISBURSEMENT = 'loan_disbursement',
  LOAN_REPAYMENT = 'loan_repayment'
}