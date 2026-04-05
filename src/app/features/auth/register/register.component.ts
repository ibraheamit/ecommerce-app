import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';
import { FavoritesService } from '../../../core/services/favorites.service';
import { environment } from '../../../../environments/environment';

// Custom validator: passwords must match
function passwordsMatchValidator(group: AbstractControl) {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass === confirm ? null : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <!-- Left Visual -->
        <div class="auth-visual d-none d-lg-flex">
          <div class="auth-visual-content">
            <div class="auth-brand">
              <div class="brand-icon-lg"><i class="bi bi-bag-heart-fill"></i></div>
              <h2>ShopWave</h2>
            </div>
            <h3>Join Our Community</h3>
            <p>Create your free account and start shopping today. Exclusive deals, order tracking, and more.</p>
            <div class="auth-features">
              <div class="auth-feature"><i class="bi bi-check-circle-fill"></i> Free account forever</div>
              <div class="auth-feature"><i class="bi bi-check-circle-fill"></i> Track all your orders</div>
              <div class="auth-feature"><i class="bi bi-check-circle-fill"></i> Save your favorites</div>
              <div class="auth-feature"><i class="bi bi-check-circle-fill"></i> Exclusive member deals</div>
            </div>
          </div>
        </div>

        <!-- Right Form -->
        <div class="auth-form-panel">
          <div class="auth-form-inner">
            <div class="auth-header">
              <a routerLink="/" class="back-link"><i class="bi bi-arrow-left"></i> Back to store</a>
              <h1>Create Account</h1>
              <p>Already have one? <a routerLink="/auth/login" class="link-primary">Sign in</a></p>
            </div>

            @if (errorMessage) {
              <div class="alert alert-danger d-flex align-items-center gap-2" role="alert">
                <i class="bi bi-exclamation-circle-fill"></i> {{ errorMessage }}
              </div>
            }

            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" novalidate>
              <!-- Name -->
              <div class="mb-3">
                <label for="name" class="form-label">Full Name</label>
                <div class="input-icon-wrap">
                  <i class="bi bi-person input-icon"></i>
                  <input
                    type="text"
                    id="name"
                    class="form-control input-with-icon"
                    formControlName="name"
                    placeholder="Your full name"
                    autocomplete="name"
                    [class.is-invalid]="nameError"
                  />
                </div>
                @if (nameError) {
                  <div class="invalid-feedback d-block">{{ nameError }}</div>
                }
              </div>

              <!-- Email -->
              <div class="mb-3">
                <label for="email" class="form-label">Email Address</label>
                <div class="input-icon-wrap">
                  <i class="bi bi-envelope input-icon"></i>
                  <input
                    type="email"
                    id="email"
                    class="form-control input-with-icon"
                    formControlName="email"
                    placeholder="you@example.com"
                    autocomplete="email"
                    [class.is-invalid]="emailError"
                  />
                </div>
                @if (emailError) {
                  <div class="invalid-feedback d-block">{{ emailError }}</div>
                }
              </div>

              <!-- Password -->
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <div class="input-icon-wrap">
                  <i class="bi bi-lock input-icon"></i>
                  <input
                    [type]="showPassword ? 'text' : 'password'"
                    id="password"
                    class="form-control input-with-icon input-with-toggle"
                    formControlName="password"
                    placeholder="Min. 6 characters"
                    autocomplete="new-password"
                    [class.is-invalid]="passError"
                  />
                  <button type="button" class="password-toggle" (click)="showPassword = !showPassword" aria-label="Toggle password">
                    <i [class]="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                @if (passError) {
                  <div class="invalid-feedback d-block">{{ passError }}</div>
                }
                <!-- Password Strength -->
                @if (registerForm.get('password')?.value) {
                  <div class="password-strength mt-2">
                    <div class="strength-bars">
                      @for (i of [1,2,3,4]; track i) {
                        <div class="strength-bar" [class.active]="passwordStrength >= i" [attr.data-level]="i"></div>
                      }
                    </div>
                    <span class="strength-label">{{ strengthLabel }}</span>
                  </div>
                }
              </div>

              <!-- Confirm Password -->
              <div class="mb-4">
                <label for="confirmPassword" class="form-label">Confirm Password</label>
                <div class="input-icon-wrap">
                  <i class="bi bi-lock-fill input-icon"></i>
                  <input
                    type="password"
                    id="confirmPassword"
                    class="form-control input-with-icon"
                    formControlName="confirmPassword"
                    placeholder="Repeat your password"
                    autocomplete="new-password"
                    [class.is-invalid]="confirmPassError"
                  />
                </div>
                @if (confirmPassError) {
                  <div class="invalid-feedback d-block">{{ confirmPassError }}</div>
                }
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100 btn-lg"
                [disabled]="isLoading"
                aria-label="Create your account"
              >
                @if (isLoading) {
                  <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating account...
                } @else {
                  <i class="bi bi-person-check"></i> Create Account
                }
              </button>
            </form>

            <div class="auth-divider"><span>Already registered?</span></div>
            <a routerLink="/auth/login" class="btn btn-outline-primary w-100">
              <i class="bi bi-box-arrow-in-right"></i> Sign In Instead
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: stretch;
      padding-top: 70px;
      background: var(--bg-primary);
    }

    .auth-container {
      display: flex;
      width: 100%;
    }

    .auth-visual {
      flex: 1;
      background: linear-gradient(135deg, #7c3aed 0%, var(--color-primary) 100%);
      color: white;
      padding: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .auth-visual-content { max-width: 380px; }

    .auth-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .brand-icon-lg {
      width: 52px;
      height: 52px;
      background: rgba(255,255,255,0.15);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
    }

    .auth-brand h2 { font-size: 1.6rem; font-weight: 800; margin: 0; }

    .auth-visual h3 { font-size: 1.75rem; font-weight: 800; margin-bottom: 0.75rem; }
    .auth-visual p { opacity: 0.88; line-height: 1.7; margin-bottom: 1.5rem; }

    .auth-features { display: flex; flex-direction: column; gap: 0.75rem; }
    .auth-feature { display: flex; align-items: center; gap: 0.6rem; font-weight: 500; }

    .auth-form-panel {
      flex: 0 0 480px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2.5rem;
    }

    .auth-form-inner { width: 100%; max-width: 400px; }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.85rem;
      color: var(--color-text-muted);
      text-decoration: none;
      margin-bottom: 1.5rem;
      transition: color 0.2s;
    }
    .back-link:hover { color: var(--color-primary); }

    .auth-header h1 { font-size: 1.75rem; font-weight: 800; margin: 0 0 0.25rem; }
    .auth-header p { color: var(--color-text-muted); margin-bottom: 1.5rem; }
    .auth-header a { color: var(--color-primary); font-weight: 600; }

    .input-icon-wrap { position: relative; }
    .input-icon {
      position: absolute;
      left: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-muted);
      font-size: 0.9rem;
      z-index: 1;
    }
    .input-with-icon { padding-left: 2.4rem; }
    .input-with-toggle { padding-right: 2.8rem; }
    .password-toggle {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--color-text-muted);
      cursor: pointer;
      padding: 0;
      font-size: 1rem;
    }

    .invalid-feedback { color: var(--color-danger); font-size: 0.8rem; margin-top: 0.3rem; }

    /* Password Strength */
    .password-strength {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .strength-bars {
      display: flex;
      gap: 4px;
      flex: 1;
    }

    .strength-bar {
      height: 4px;
      flex: 1;
      border-radius: 2px;
      background: var(--color-border);
      transition: background 0.3s;
    }

    .strength-bar.active[data-level="1"] { background: var(--color-danger); }
    .strength-bar.active[data-level="2"] { background: #f97316; }
    .strength-bar.active[data-level="3"] { background: var(--color-warning); }
    .strength-bar.active[data-level="4"] { background: var(--color-success); }

    .strength-label { font-size: 0.75rem; color: var(--color-text-muted); white-space: nowrap; }

    .auth-divider {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 1.25rem 0;
      font-size: 0.8rem;
      color: var(--color-text-muted);
    }

    .auth-divider::before,
    .auth-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--color-border);
    }

    @media (max-width: 991px) {
      .auth-form-panel { flex: 1; max-width: 100%; }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private http: HttpClient,
    private router: Router
  ) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordsMatchValidator });
  }

  get nameError(): string | null {
    const ctrl = this.registerForm.get('name');
    if (ctrl?.touched && ctrl?.invalid) {
      if (ctrl.hasError('required')) return 'Name is required';
      if (ctrl.hasError('minlength')) return 'Name must be at least 2 characters';
    }
    return null;
  }

  get emailError(): string | null {
    const ctrl = this.registerForm.get('email');
    if (ctrl?.touched && ctrl?.invalid) {
      if (ctrl.hasError('required')) return 'Email is required';
      if (ctrl.hasError('email')) return 'Please enter a valid email';
    }
    return null;
  }

  get passError(): string | null {
    const ctrl = this.registerForm.get('password');
    if (ctrl?.touched && ctrl?.invalid) {
      if (ctrl.hasError('required')) return 'Password is required';
      if (ctrl.hasError('minlength')) return 'Password must be at least 6 characters';
    }
    return null;
  }

  get confirmPassError(): string | null {
    const ctrl = this.registerForm.get('confirmPassword');
    if (ctrl?.touched) {
      if (ctrl.hasError('required')) return 'Please confirm your password';
      if (this.registerForm.hasError('passwordsMismatch')) return 'Passwords do not match';
    }
    return null;
  }

  get passwordStrength(): number {
    const pass = this.registerForm.get('password')?.value || '';
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.length >= 10) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9!@#$%^&*]/.test(pass)) strength++;
    return strength;
  }

  get strengthLabel(): string {
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    return labels[this.passwordStrength] || '';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const { name, email, password } = this.registerForm.value;

    this.authService.register(name, email, password).subscribe({
      next: res => {
        if (res.success) {
          const newUserId = this.authService.getCurrentUserId();
          if (newUserId) {
            this.favoritesService.loadFavorites(newUserId).subscribe();
          }
          this.router.navigate(['/']);
        } else {
          this.errorMessage = res.message;
          this.isLoading = false;
        }
      },
      error: () => {
        this.errorMessage = 'Registration failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
