import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';

export interface PrivacySettings {
  showBalances: boolean;
  showTransactions: boolean;
  showLoanDetails: boolean;
  showPersonalInfo: boolean;
  requirePinForActions: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PrivacyService {
  private privacySettingsSubject = new BehaviorSubject<PrivacySettings>({
    showBalances: true,
    showTransactions: true,
    showLoanDetails: true,
    showPersonalInfo: true,
    requirePinForActions: false
  });

  public privacySettings$ = this.privacySettingsSubject.asObservable();

  constructor(private storageService: StorageService) {
    this.loadPrivacySettings();
  }

  getPrivacySettings(): PrivacySettings {
    return this.privacySettingsSubject.value;
  }

  updatePrivacySettings(settings: Partial<PrivacySettings>): void {
    const currentSettings = this.privacySettingsSubject.value;
    const newSettings = { ...currentSettings, ...settings };
    this.privacySettingsSubject.next(newSettings);
    this.storageService.setItem('privacySettings', JSON.stringify(newSettings));
  }

  toggleBalanceVisibility(): void {
    const current = this.privacySettingsSubject.value;
    this.updatePrivacySettings({ showBalances: !current.showBalances });
  }

  private loadPrivacySettings(): void {
    const settingsStr = this.storageService.getItem('privacySettings');
    if (settingsStr) {
      try {
        const settings = JSON.parse(settingsStr);
        this.privacySettingsSubject.next(settings);
      } catch (error) {
        console.error('Error loading privacy settings:', error);
      }
    }
  }
}