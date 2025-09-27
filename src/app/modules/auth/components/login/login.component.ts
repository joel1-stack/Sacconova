import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { TranslationService, Language, isValidLanguage } from '../../../../core/services/translation.service';
import { StorageService } from '../../../../core/services/storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  loginError = false;
  showPassword = false;
  rememberMe = false;
  show2FA = false;
  tfaCode = '';
  showCaptcha = false;
  captchaQuestion = '';
  captchaAnswer = '';
  captchaValid = false;
  
  // Theme and Language
  isDarkMode = false;
  selectedLanguage: Language = 'en';
  
  // Password Strength
  passwordStrength = {
    level: 'weak',
    percentage: 0,
    text: 'Weak'
  };
  
  // Live Statistics
  memberCount = 1250;
  loanCount = 850;
  
  // Biometric Support
  biometricSupported = false;
  
  // Testimonials
  testimonials = [
    {
      text: 'SaccoNova transformed our SACCO operations completely. Digital banking made easy!',
      author: 'Mary Wanjiku',
      role: 'SACCO Chairperson'
    },
    {
      text: 'Loan processing is now instant. Our members love the mobile banking features.',
      author: 'John Kamau',
      role: 'SACCO Manager'
    },
    {
      text: 'Security and transparency - exactly what we needed for our cooperative.',
      author: 'Grace Akinyi',
      role: 'SACCO Treasurer'
    }
  ];
  currentTestimonial = 0;
  
  private testimonialInterval: any;
  private statsInterval: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private translationService: TranslationService,
    private storageService: StorageService
  ) {
    this.loginForm = this.fb.group({
      email: ['admin@sacconova.com', [Validators.required, Validators.email]],
      password: ['admin123', [Validators.required, Validators.minLength(6)]]
    });
    
    this.loadUserPreferences();
    this.checkBiometricSupport();
    this.generateCaptcha();
  }

  ngOnInit(): void {
    this.startLiveStats();
    this.startTestimonialCarousel();
    this.focusFirstField();
  }

  ngOnDestroy(): void {
    if (this.testimonialInterval) clearInterval(this.testimonialInterval);
    if (this.statsInterval) clearInterval(this.statsInterval);
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openContact(): void {
    window.open('tel:+254715641339', '_self');
  }

  onSubmit(): void {
    if (this.loginForm.valid && (!this.showCaptcha || this.captchaValid)) {
      this.isLoading = true;
      this.loginError = false;
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response.success) {
            if (this.rememberMe) {
              this.storageService.setItem('rememberMe', 'true');
            }
            // Simulate 2FA for demo
            if (email === 'admin@sacconova.com') {
              this.show2FA = true;
              this.isLoading = false;
            } else {
              this.completeLogin();
            }
          } else {
            this.handleLoginError(response.message);
          }
        },
        error: (error) => {
          this.handleLoginError('Login failed. Use demo credentials.');
        }
      });
    } else {
      this.notificationService.show('warning', 'Please fill in all required fields correctly.');
    }
  }

  private handleLoginError(message: string): void {
    this.isLoading = false;
    this.loginError = true;
    this.showCaptcha = true;
    this.notificationService.show('error', message);
    setTimeout(() => this.loginError = false, 500);
  }

  private completeLogin(): void {
    this.isLoading = false;
    this.notificationService.showSuccess('Welcome to SaccoNova!');
    this.router.navigate(['/dashboard']);
  }

  // Advanced Features
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  checkPasswordStrength(): void {
    const password = this.password?.value || '';
    let strength = 0;
    let text = 'Weak';
    
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    if (strength >= 75) text = 'Strong';
    else if (strength >= 50) text = 'Medium';
    else if (strength >= 25) text = 'Fair';
    
    this.passwordStrength = {
      level: text.toLowerCase(),
      percentage: strength,
      text
    };
  }

  validateEmailRealTime(): void {
    // Real-time email validation feedback
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
    this.storageService.setItem('darkMode', this.isDarkMode.toString());
  }

  changeLanguage(event: any): void {
    const newLang = event.target.value;
    if (isValidLanguage(newLang)) {
      this.selectedLanguage = newLang;
      this.translationService.setLanguage(newLang);
      this.storageService.setItem('language', newLang);
    }
  }

  translate(key: string): string {
    return this.translationService.translate(key);
  }

  // 2FA Methods
  verify2FA(): void {
    if (this.tfaCode === '123456') {
      this.show2FA = false;
      this.completeLogin();
    } else {
      this.notificationService.show('error', 'Invalid verification code. Use 123456 for demo.');
    }
  }

  cancel2FA(): void {
    this.show2FA = false;
    this.isLoading = false;
  }

  // Social Login
  loginWithGoogle(): void {
    this.notificationService.show('info', 'Google login would be integrated here.');
  }

  loginAsDemo(): void {
    this.loginForm.patchValue({
      email: 'admin@sacconova.com',
      password: 'admin123'
    });
    this.onSubmit();
  }

  // Biometric Login
  loginWithBiometric(): void {
    this.notificationService.show('info', 'Biometric authentication would be integrated here.');
  }

  // Forgot Password
  openForgotPassword(event: Event): void {
    event.preventDefault();
    const email = prompt('Enter your email for password reset:');
    if (email) {
      this.notificationService.showSuccess('Password reset link sent to ' + email);
    }
  }

  // CAPTCHA
  private generateCaptcha(): void {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    this.captchaQuestion = `${num1} + ${num2} = ?`;
    this.captchaAnswer = '';
  }

  // Helper Methods
  private loadUserPreferences(): void {
    const darkMode = this.storageService.getItem('darkMode');
    const language = this.storageService.getItem('language');
    const rememberMe = this.storageService.getItem('rememberMe');
    
    if (darkMode === 'true') {
      this.isDarkMode = true;
      document.body.classList.add('dark-theme');
    }
    
    if (language && isValidLanguage(language)) {
      this.selectedLanguage = language;
      this.translationService.setLanguage(language);
    }
    
    if (rememberMe === 'true') {
      this.rememberMe = true;
    }
  }

  private checkBiometricSupport(): void {
    this.biometricSupported = 'credentials' in navigator;
  }

  private focusFirstField(): void {
    setTimeout(() => {
      const firstInput = document.querySelector('#email') as HTMLInputElement;
      if (firstInput) firstInput.focus();
    }, 100);
  }

  private startLiveStats(): void {
    this.statsInterval = setInterval(() => {
      this.memberCount += Math.floor(Math.random() * 3);
      this.loanCount += Math.floor(Math.random() * 2);
    }, 5000);
  }

  private startTestimonialCarousel(): void {
    this.testimonialInterval = setInterval(() => {
      this.currentTestimonial = (this.currentTestimonial + 1) % this.testimonials.length;
    }, 4000);
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}