import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

export interface SearchFilter {
  category: 'all' | 'members' | 'transactions' | 'loans' | 'accounts';
  dateRange?: { start: Date; end: Date };
  amountRange?: { min: number; max: number };
  status?: string[];
}

export interface SearchResult {
  id: string;
  type: 'member' | 'transaction' | 'loan' | 'account';
  title: string;
  subtitle: string;
  amount?: number;
  date?: Date;
  status?: string;
  relevanceScore: number;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private mockData: SearchResult[] = [
    {
      id: '1',
      type: 'member',
      title: 'John Doe',
      subtitle: 'Member ID: MEM001 | Phone: +254712345678',
      relevanceScore: 0.95
    },
    {
      id: '2',
      type: 'transaction',
      title: 'Savings Deposit',
      subtitle: 'Account: SAV001 | Reference: TXN12345',
      amount: 15000,
      date: new Date('2024-01-15'),
      status: 'completed',
      relevanceScore: 0.88
    },
    {
      id: '3',
      type: 'loan',
      title: 'Personal Loan',
      subtitle: 'Loan ID: LN001 | Borrower: John Doe',
      amount: 100000,
      date: new Date('2024-01-10'),
      status: 'active',
      relevanceScore: 0.82
    }
  ];

  search(query: string, filters: SearchFilter = { category: 'all' }): Observable<SearchResult[]> {
    return of(this.mockData).pipe(
      delay(300),
      map(results => this.filterResults(results, query, filters))
    );
  }

  getSearchSuggestions(query: string): Observable<string[]> {
    const suggestions = [
      'John Doe',
      'Savings Account',
      'Loan Application',
      'Transaction History',
      'Member Registration',
      'Payment Schedule'
    ];

    return of(suggestions.filter(s => 
      s.toLowerCase().includes(query.toLowerCase())
    )).pipe(delay(200));
  }

  private filterResults(results: SearchResult[], query: string, filters: SearchFilter): SearchResult[] {
    let filtered = results;

    // Filter by query
    if (query.trim()) {
      filtered = filtered.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.subtitle.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(result => {
        switch (filters.category) {
          case 'members': return result.type === 'member';
          case 'transactions': return result.type === 'transaction';
          case 'loans': return result.type === 'loan';
          case 'accounts': return result.type === 'account';
          default: return true;
        }
      });
    }

    // Filter by date range
    if (filters.dateRange && filters.dateRange.start && filters.dateRange.end) {
      filtered = filtered.filter(result => {
        if (!result.date) return false;
        return result.date >= filters.dateRange!.start && result.date <= filters.dateRange!.end;
      });
    }

    // Filter by amount range
    if (filters.amountRange) {
      filtered = filtered.filter(result => {
        if (!result.amount) return false;
        return result.amount >= (filters.amountRange!.min || 0) && 
               result.amount <= (filters.amountRange!.max || Infinity);
      });
    }

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(result => 
        result.status && filters.status!.includes(result.status)
      );
    }

    // Sort by relevance score
    return filtered.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  saveSearch(query: string, filters: SearchFilter): void {
    const searches = this.getSavedSearches();
    const newSearch = {
      id: Date.now().toString(),
      query,
      filters,
      timestamp: new Date()
    };
    searches.unshift(newSearch);
    localStorage.setItem('savedSearches', JSON.stringify(searches.slice(0, 10)));
  }

  getSavedSearches(): any[] {
    const saved = localStorage.getItem('savedSearches');
    return saved ? JSON.parse(saved) : [];
  }
}