import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-container">
        <!-- Left: Visual Panel -->
        <div class="auth-visual d-none d-lg-flex">
          <div class="auth-visual-content">
            <div class="auth-brand">
              <div class="brand-icon-lg">
                <i class="bi bi-bag-heart-fill"></i>
              </div>
              <h2>ShopWave</h2>
            </div>
            <h3>Welcome Back!</h3>
            <p>Sign in to access your cart, orders, and personalized recommendations.</p>
            <div class="auth-features">
              <div class="auth-feature"><i class="bi bi-check-circle-fill"></i> Your orders & history</div>
              <div class="auth-feature"><i class="bi bi-check-circle-fill"></i> Saved favorites</div>
              <div class="auth-feature"><i class="bi bi-check-circle-fill"></i> Secure checkout</div>
            </div>
            <!-- Demo Credentials -->
            <div class="demo-credentials">
              <p class="demo-title">Demo Accounts:</p>
              <div class="demo-item">
                <strong>User:</strong> john&#64;example.com / user123
              </div>
              <div class="demo-item">
                <strong>Admin:</strong> admin&#64;shopwave.com / admin123
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Form Panel -->
        <div class="auth-form-panel">
          <div class="auth-form-inner">
            <div class="auth-header">
              <a routerLink="/" class="back-link">
                <i class="bi bi-arrow-left"></i> Back to store
              </a>
              <h1>Sign In</h1>
              <p>Don't have an account? <a routerLink="/auth/register" class="link-primary">Create one</a></p>
            </div>

            <!-- Error Alert -->
            @if (errorMessage) {
              <div class="alert alert-danger d-flex align-items-center gap-2" role="alert">
                <i class="bi bi-exclamation-circle-fill"></i>
                {{ errorMessage }}
              </div>
            }

            <!-- Success Alert -->
            @if (successMessage) {
              <div class="alert alert-success d-flex align-items-center gap-2" role="alert">
                <i class="bi bi-check-circle-fill"></i>
                {{ successMessage }}
              </div>
            }

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" novalidate>
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
              <div class="mb-4">
                <label for="password" class="form-label">Password</label>
                <div class="input-icon-wrap">
                  <i class="bi bi-lock input-icon"></i>
                  <input
                    [type]="showPassword ? 'text' : 'password'"
                    id="password"
                    class="form-control input-with-icon input-with-toggle"
                    formControlName="password"
                    placeholder="Your password"
                    autocomplete="current-password"
                    [class.is-invalid]="passwordError"
                  />
                  <button
                    type="button"
                    class="password-toggle"
                    (click)="showPassword = !showPassword"
                    [attr.aria-label]="showPassword ? 'Hide password' : 'Show password'"
                  >
                    <i [class]="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                @if (passwordError) {
                  <div class="invalid-feedback d-block">{{ passwordError }}</div>
                }
              </div>

              <!-- Submit -->
              <button
                type="submit"
                class="btn btn-primary w-100 btn-lg"
                [disabled]="isLoading"
                aria-label="Sign in to your account"
              >
                @if (isLoading) {
                  <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                } @else {
                  <i class="bi bi-box-arrow-in-right"></i> Sign In
                }
              </button>
            </form>

            <div class="auth-divider">
              <span>or continue with</span>
            </div>

            <a routerLink="/auth/register" class="btn btn-outline-primary w-100">
              <i class="bi bi-person-plus"></i> Create New Account
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
      max-width: 100%;
    }

    /* Visual Panel */
    .auth-visual {
      flex: 1;
      background: linear-gradient(135deg, var(--color-primary) 0%, #7c3aed 100%);
      color: white;
      padding: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .auth-visual-content {
      max-width: 380px;
    }

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
      backdrop-filter: blur(8px);
    }

    .auth-brand h2 {
      font-size: 1.6rem;
      font-weight: 800;
      margin: 0;
    }

    .auth-visual h3 {
      font-size: 1.75rem;
      font-weight: 800;
      margin-bottom: 0.75rem;
    }

    .auth-visual p {
      opacity: 0.88;
      line-height: 1.7;
      margin-bottom: 1.5rem;
    }

    .auth-features {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .auth-feature {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-weight: 500;
    }

    .auth-feature i {
      color: rgba(255,255,255,0.8);
    }

    .demo-credentials {
      background: rgba(255,255,255,0.1);
      border-radius: var(--radius-lg);
      padding: 1rem 1.25rem;
      backdrop-filter: blur(8px);
    }

    .demo-title {
      font-weight: 700;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .demo-item {
      font-size: 0.8rem;
      opacity: 0.85;
      font-family: monospace;
      margin-bottom: 0.25rem;
    }

    /* Form Panel */
    .auth-form-panel {
      flex: 0 0 480px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2.5rem;
    }

    .auth-form-inner {
      width: 100%;
      max-width: 400px;
    }

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

    .auth-header h1 {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--color-text);
      margin: 0 0 0.25rem;
    }

    .auth-header p {
      color: var(--color-text-muted);
      margin-bottom: 1.5rem;
    }

    .auth-header a {
      color: var(--color-primary);
      font-weight: 600;
    }

    /* Input with Icon */
    .input-icon-wrap {
      position: relative;
    }

    .input-icon {
      position: absolute;
      left: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-muted);
      font-size: 0.9rem;
      z-index: 1;
    }

    .input-with-icon {
      padding-left: 2.4rem;
    }

    .input-with-toggle {
      padding-right: 2.8rem;
    }

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

    .password-toggle:hover { color: var(--color-primary); }

    .invalid-feedback {
      color: var(--color-danger);
      font-size: 0.8rem;
      margin-top: 0.3rem;
    }

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
      .auth-form-panel {
        flex: 1;
        max-width: 100%;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false;
  returnUrl = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get emailError(): string | null {
    const ctrl = this.loginForm.get('email');
    if (ctrl?.touched && ctrl?.invalid) {
      if (ctrl.hasError('required')) return 'Email is required';
      if (ctrl.hasError('email')) return 'Please enter a valid email';
    }
    return null;
  }

  get passwordError(): string | null {
    const ctrl = this.loginForm.get('password');
    if (ctrl?.touched && ctrl?.invalid) {
      if (ctrl.hasError('required')) return 'Password is required';
      if (ctrl.hasError('minlength')) return 'Password must be at least 6 characters';
    }
    return null;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe(result => {
      if (result.success) {
        // Load favorites after login
        const userId = this.authService.getCurrentUserId();
        if (userId) {
          this.favoritesService.loadFavorites(userId).subscribe();
        }
        this.successMessage = 'Login successful! Redirecting...';
        setTimeout(() => {
          this.router.navigateByUrl(this.returnUrl);
        }, 800);
      } else {
        this.errorMessage = result.message;
        this.isLoading = false;
      }
    });
  }
}
