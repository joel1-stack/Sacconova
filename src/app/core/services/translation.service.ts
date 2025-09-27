import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Language = 'en' | 'sw';

export function isValidLanguage(lang: string): lang is Language {
  return lang === 'en' || lang === 'sw';
}

interface Translations {
  [key: string]: {
    en: string;
    sw: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage = new BehaviorSubject<Language>('en');
  
  private translations: Translations = {
    // Login Page
    'member_login': { en: 'Member Login', sw: 'Kuingia kwa Mwanachama' },
    'access_account': { en: 'Access your account', sw: 'Fikia akaunti yako' },
    'email': { en: 'Email', sw: 'Barua pepe' },
    'password': { en: 'Password', sw: 'Nywila' },
    'enter_email': { en: 'Enter your email', sw: 'Ingiza barua pepe yako' },
    'enter_password': { en: 'Enter your password', sw: 'Ingiza nywila yako' },
    'email_required': { en: 'Email is required', sw: 'Barua pepe inahitajika' },
    'email_invalid': { en: 'Please enter a valid email', sw: 'Tafadhali ingiza barua pepe sahihi' },
    'password_required': { en: 'Password is required', sw: 'Nywila inahitajika' },
    'password_minlength': { en: 'Password must be at least 6 characters', sw: 'Nywila lazima iwe angalau herufi 6' },
    'remember_me': { en: 'Remember me', sw: 'Nikumbuke' },
    'forgot_password': { en: 'Forgot password?', sw: 'Umesahau nywila?' },
    'sign_in': { en: 'Sign In', sw: 'Ingia' },
    'signing_in': { en: 'Signing in...', sw: 'Kuingia...' },
    'or_continue_with': { en: 'Or continue with', sw: 'Au endelea na' },
    'demo_mode': { en: 'Demo Mode', sw: 'Hali ya Onyesho' },
    'demo_credentials': { en: 'Demo', sw: 'Onyesho' },
    'not_member': { en: 'Not a member yet?', sw: 'Bado hujasajiliwa?' },
    'apply_membership': { en: 'Apply for Membership', sw: 'Omba Uanachama' },
    'use_biometric': { en: 'Use Fingerprint', sw: 'Tumia Alama ya Kidole' },
    'two_factor_auth': { en: 'Two-Factor Authentication', sw: 'Uthibitisho wa Hatua Mbili' },
    'enter_verification_code': { en: 'Enter the verification code sent to your phone', sw: 'Ingiza msimbo wa uthibitisho uliotumwa kwenye simu yako' },
    'verify': { en: 'Verify', sw: 'Thibitisha' },
    'cancel': { en: 'Cancel', sw: 'Ghairi' },
    'about_sacconova': { en: 'About SaccoNova', sw: 'Kuhusu SaccoNova' },
    'about_description': { en: 'SaccoNova is a cutting-edge financial technology platform designed specifically for Savings and Credit Cooperative Organizations (SACCOs). We empower financial cooperatives with modern digital solutions.', sw: 'SaccoNova ni jukwaa la kisasa la teknolojia ya kifedha lililobuniwa maalum kwa Mashirika ya Ushirika wa Akiba na Mikopo (SACCOs). Tunawezesha vyama vya ushirika wa kifedha kwa suluhisho za kisasa za kidijitali.' },
    'member_testimonials': { en: 'Member Testimonials', sw: 'Ushuhuda wa Wanachama' },
    'get_in_touch': { en: 'Get in Touch', sw: 'Wasiliana Nasi' },
    'phone': { en: 'Phone', sw: 'Simu' },
    'download_app': { en: 'Download Mobile App', sw: 'Pakua Programu ya Simu' },
    
    // Legacy translations
    'login.title': { en: 'Member Login', sw: 'Kuingia Mwanachama' },
    'login.email': { en: 'Email', sw: 'Barua Pepe' },
    'login.password': { en: 'Password', sw: 'Nywila' },
    'login.signin': { en: 'Sign In', sw: 'Ingia' },
    'dashboard.welcome': {
      en: 'Welcome Back',
      sw: 'Karibu Tena'
    },
    'dashboard.savings': {
      en: 'Savings',
      sw: 'Akiba'
    },
    'dashboard.loans': {
      en: 'Loans',
      sw: 'Mikopo'
    },
    'dashboard.transactions': {
      en: 'Transactions',
      sw: 'Miamala'
    },
    'loan.apply': {
      en: 'Apply for Loan',
      sw: 'Omba Mkopo'
    },
    'loan.amount': {
      en: 'Loan Amount',
      sw: 'Kiasi cha Mkopo'
    },
    'loan.purpose': {
      en: 'Purpose of Loan',
      sw: 'Madhumuni ya Mkopo'
    },
    'account.balance': {
      en: 'Account Balance',
      sw: 'Salio la Akaunti'
    },
    'mpesa.deposit': {
      en: 'M-Pesa Deposit',
      sw: 'Uwekaji M-Pesa'
    },
    'mpesa.withdraw': {
      en: 'M-Pesa Withdrawal',
      sw: 'Utolaji M-Pesa'
    },
    'common.submit': {
      en: 'Submit',
      sw: 'Wasilisha'
    },
    'common.cancel': {
      en: 'Cancel',
      sw: 'Ghairi'
    },
    'common.loading': {
      en: 'Loading...',
      sw: 'Inapakia...'
    },
    'error.required': {
      en: 'This field is required',
      sw: 'Sehemu hii inahitajika'
    },
    'success.saved': {
      en: 'Successfully saved',
      sw: 'Imehifadhiwa kikamilifu'
    }
  };

  getCurrentLanguage(): Observable<Language> {
    return this.currentLanguage.asObservable();
  }

  setLanguage(language: Language | string): void {
    const validLang = isValidLanguage(language) ? language : 'en';
    this.currentLanguage.next(validLang);
    localStorage.setItem('language', validLang);
  }

  translate(key: string): string {
    const translation = this.translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation[this.currentLanguage.value];
  }

  initializeLanguage(): void {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && isValidLanguage(savedLanguage)) {
      this.currentLanguage.next(savedLanguage);
    }
  }
}