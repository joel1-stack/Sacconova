export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface DashboardStats {
  totalMembers: number;
  totalSavings: number;
  totalLoans: number;
  totalShares: number;
  pendingLoans: number;
  activeLoans: number;
}

import { User } from './user.model';