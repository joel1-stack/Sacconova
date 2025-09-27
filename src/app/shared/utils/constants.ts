export const APP_CONSTANTS = {
  APP_NAME: 'SaccoNova',
  VERSION: '1.0.0',
  CURRENCY: 'KES',
  DATE_FORMAT: 'dd/MM/yyyy',
  DATETIME_FORMAT: 'dd/MM/yyyy HH:mm'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/login',
    LOGOUT: 'auth/logout',
    REFRESH: 'auth/refresh'
  },
  ACCOUNTS: {
    LIST: 'accounts',
    DETAILS: 'accounts/:id',
    STATEMENT: 'accounts/:id/statement'
  },
  LOANS: {
    LIST: 'loans',
    APPLY: 'loans/apply',
    DETAILS: 'loans/:id'
  },
  TRANSACTIONS: {
    LIST: 'transactions',
    CREATE: 'transactions'
  }
};

export const LOAN_PRODUCTS = [
  { id: '1', name: 'Personal Loan', minAmount: 10000, maxAmount: 500000, interestRate: 12 },
  { id: '2', name: 'Business Loan', minAmount: 50000, maxAmount: 2000000, interestRate: 10 },
  { id: '3', name: 'Emergency Loan', minAmount: 5000, maxAmount: 100000, interestRate: 15 }
];