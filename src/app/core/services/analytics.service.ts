import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface FinancialChart {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
  }[];
}

export interface MemberAnalytics {
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  memberGrowthRate: number;
  ageDistribution: { range: string; count: number }[];
  genderDistribution: { gender: string; count: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  getSavingsTrends(period: 'week' | 'month' | 'year'): Observable<FinancialChart> {
    const mockData: FinancialChart = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Savings Growth',
        data: [1200000, 1350000, 1500000, 1650000, 1800000, 2000000],
        backgroundColor: ['#00c6f9', '#ff9500', '#9bff00', '#7700ff'],
        borderColor: '#00c6f9'
      }]
    };
    return of(mockData).pipe(delay(500));
  }

  getLoanPerformance(): Observable<FinancialChart> {
    const mockData: FinancialChart = {
      labels: ['Performing', 'Watch', 'Substandard', 'Doubtful', 'Loss'],
      datasets: [{
        label: 'Loan Portfolio Quality',
        data: [85, 8, 4, 2, 1],
        backgroundColor: ['#9bff00', '#ff9500', '#00c6f9', '#7700ff', '#ff0000']
      }]
    };
    return of(mockData).pipe(delay(500));
  }

  getMemberAnalytics(): Observable<MemberAnalytics> {
    const mockData: MemberAnalytics = {
      totalMembers: 1250,
      activeMembers: 1180,
      newMembersThisMonth: 45,
      memberGrowthRate: 3.7,
      ageDistribution: [
        { range: '18-25', count: 180 },
        { range: '26-35', count: 420 },
        { range: '36-45', count: 380 },
        { range: '46-55', count: 200 },
        { range: '55+', count: 70 }
      ],
      genderDistribution: [
        { gender: 'Female', count: 720 },
        { gender: 'Male', count: 530 }
      ]
    };
    return of(mockData).pipe(delay(500));
  }

  getTransactionAnalytics(period: string): Observable<any> {
    return of({
      totalTransactions: 15420,
      totalValue: 45600000,
      averageTransaction: 2956,
      peakHours: ['10:00', '14:00', '16:00'],
      channelDistribution: {
        mobile: 65,
        web: 25,
        branch: 10
      }
    }).pipe(delay(500));
  }

  getCreditScoreDistribution(): Observable<FinancialChart> {
    return of({
      labels: ['Excellent (750+)', 'Good (700-749)', 'Fair (650-699)', 'Poor (600-649)', 'Bad (<600)'],
      datasets: [{
        label: 'Credit Score Distribution',
        data: [25, 35, 25, 10, 5],
        backgroundColor: ['#9bff00', '#00c6f9', '#ff9500', '#7700ff', '#ff0000']
      }]
    }).pipe(delay(500));
  }
}