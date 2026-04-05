import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { OrderProduct } from '../../core/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="checkout-page" style="padding-top: 70px;">
      <div class="page-header">
        <div class="container">
          <h1 class="page-title">Checkout</h1>
          <nav aria-label="Breadcrumb">
            <ol class="breadcrumb-custom">
              <li><a routerLink="/cart">Cart</a></li>
              <li><i class="bi bi-chevron-right"></i></li>
              <li aria-current="page">Checkout</li>
            </ol>
          </nav>
        </div>
      </div>

      <div class="container py-4">
        @if (cartService.items().length === 0) {
          <div class="empty-state">
            <i class="bi bi-bag-x" style="font-size:4rem; color: var(--color-border);"></i>
            <h4 class="mt-3">Your cart is empty</h4>
            <a routerLink="/products" class="btn btn-primary mt-2">Shop Now</a>
          </div>
        } @else {
          <div class="row g-4">
            <!-- Form -->
            <div class="col-lg-7">
              <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()" novalidate>
                <!-- Contact Info -->
                <div class="checkout-section">
                  <div class="section-number">1</div>
                  <div class="section-content">
                    <h5 class="section-label">Contact Information</h5>
                    <div class="row g-3">
                      <div class="col-md-6">
                        <label for="name" class="form-label">Full Name *</label>
                        <input
                          type="text" id="name" class="form-control"
                          formControlName="name" placeholder="John Doe"
                          [class.is-invalid]="isInvalid('name')"
                          autocomplete="name"
                        />
                        @if (isInvalid('name')) {
                          <div class="invalid-feedback d-block">{{ getError('name') }}</div>
                        }
                      </div>
                      <div class="col-md-6">
                        <label for="email" class="form-label">Email *</label>
                        <input
                          type="email" id="email" class="form-control"
                          formControlName="email" placeholder="you@example.com"
                          [class.is-invalid]="isInvalid('email')"
                          autocomplete="email"
                        />
                        @if (isInvalid('email')) {
                          <div class="invalid-feedback d-block">{{ getError('email') }}</div>
                        }
                      </div>
                      <div class="col-12">
                        <label for="phone" class="form-label">Phone Number *</label>
                        <input
                          type="tel" id="phone" class="form-control"
                          formControlName="phone" placeholder="+1 (555) 000-0000"
                          [class.is-invalid]="isInvalid('phone')"
                          autocomplete="tel"
                        />
                        @if (isInvalid('phone')) {
                          <div class="invalid-feedback d-block">{{ getError('phone') }}</div>
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Shipping Address -->
                <div class="checkout-section">
                  <div class="section-number">2</div>
                  <div class="section-content">
                    <h5 class="section-label">Shipping Address</h5>
                    <div class="row g-3">
                      <div class="col-12">
                        <label for="address" class="form-label">Street Address *</label>
                        <input
                          type="text" id="address" class="form-control"
                          formControlName="address" placeholder="123 Main Street, Apt 4"
                          [class.is-invalid]="isInvalid('address')"
                          autocomplete="street-address"
                        />
                        @if (isInvalid('address')) {
                          <div class="invalid-feedback d-block">{{ getError('address') }}</div>
                        }
                      </div>
                      <div class="col-md-6">
                        <label for="city" class="form-label">City *</label>
                        <input
                          type="text" id="city" class="form-control"
                          formControlName="city" placeholder="New York"
                          [class.is-invalid]="isInvalid('city')"
                          autocomplete="address-level2"
                        />
                        @if (isInvalid('city')) {
                          <div class="invalid-feedback d-block">City is required</div>
                        }
                      </div>
                      <div class="col-md-6">
                        <label for="zipCode" class="form-label">ZIP Code *</label>
                        <input
                          type="text" id="zipCode" class="form-control"
                          formControlName="zipCode" placeholder="10001"
                          [class.is-invalid]="isInvalid('zipCode')"
                          autocomplete="postal-code"
                        />
                        @if (isInvalid('zipCode')) {
                          <div class="invalid-feedback d-block">{{ getError('zipCode') }}</div>
                        }
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Payment (UI only — simulated) -->
                <div class="checkout-section">
                  <div class="section-number">3</div>
                  <div class="section-content">
                    <h5 class="section-label">Payment</h5>
                    <div class="payment-demo-card">
                      <div class="payment-demo-header">
                        <span class="payment-lock"><i class="bi bi-shield-lock-fill"></i> Secure Demo Payment</span>
                        <div class="payment-icons">
                          <i class="bi bi-credit-card-2-front"></i>
                          <i class="bi bi-paypal"></i>
                        </div>
                      </div>
                      <div class="row g-3">
                        <div class="col-12">
                          <label for="cardNumber" class="form-label">Card Number</label>
                          <input type="text" id="cardNumber" class="form-control" value="4242 4242 4242 4242" readonly />
                        </div>
                        <div class="col-md-6">
                          <label for="expiry" class="form-label">Expiry</label>
                          <input type="text" id="expiry" class="form-control" value="12/28" readonly />
                        </div>
                        <div class="col-md-6">
                          <label for="cvv" class="form-label">CVV</label>
                          <input type="text" id="cvv" class="form-control" value="***" readonly />
                        </div>
                      </div>
                      <p class="demo-note mt-2">
                        <i class="bi bi-info-circle"></i>
                        This is a demo checkout. No real charge will be made.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100 btn-lg"
                  [disabled]="isLoading"
                  aria-label="Place order"
                >
                  @if (isLoading) {
                    <span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                    Processing Order...
                  } @else {
                    <i class="bi bi-bag-check"></i>
                    Place Order — \${{ getTotal() | number:'1.2-2' }}
                  }
                </button>
              </form>
            </div>

            <!-- Order Summary -->
            <div class="col-lg-5">
              <div class="checkout-summary-card">
                <h5 class="fw-800 mb-3">Order Summary</h5>

                <div class="checkout-items-list">
                  @for (item of cartService.items(); track item.product.id) {
                    <div class="checkout-item">
                      <div class="checkout-item-img">
                        <img [src]="item.product.image" [alt]="item.product.title" loading="lazy"
                             (error)="onImageError($event)"/>
                        <span class="item-qty-badge">{{ item.quantity }}</span>
                      </div>
                      <div class="checkout-item-info">
                        <p class="checkout-item-title">{{ item.product.title }}</p>
                        <p class="checkout-item-price">\${{ item.product.price | number:'1.2-2' }} each</p>
                      </div>
                      <span class="checkout-item-total fw-700">
                        \${{ (item.product.price * item.quantity) | number:'1.2-2' }}
                      </span>
                    </div>
                  }
                </div>

                <div class="checkout-summary-rows">
                  <div class="summary-row">
                    <span>Subtotal</span><span>\${{ cartService.totalPrice() | number:'1.2-2' }}</span>
                  </div>
                  <div class="summary-row">
                    <span>Shipping</span>
                    <span class="text-success">{{ cartService.totalPrice() >= 50 ? 'FREE' : '$9.99' }}</span>
                  </div>
                  <div class="summary-row">
                    <span>Tax (8%)</span><span>\${{ cartService.totalPrice() * 0.08 | number:'1.2-2' }}</span>
                  </div>
                  <div class="summary-total">
                    <span>Total</span><span class="price">\${{ getTotal() | number:'1.2-2' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .checkout-page { min-height: 100vh; background: var(--bg-primary); }
    .page-header {
      background: linear-gradient(135deg, var(--color-primary) 0%, #7c3aed 100%);
      padding: 2rem 0;
      color: white;
    }
    .page-title { font-size: 2rem; font-weight: 800; margin: 0; }
    .breadcrumb-custom {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      list-style: none;
      margin: 0.25rem 0 0;
      padding: 0;
      font-size: 0.875rem;
      opacity: 0.85;
    }
    .breadcrumb-custom a { color: rgba(255,255,255,0.85); text-decoration: none; }
    .breadcrumb-custom a:hover { color: white; }

    /* Checkout Sections */
    .checkout-section {
      display: flex;
      gap: 1.25rem;
      background: white;
      border-radius: var(--radius-xl);
      padding: 1.75rem;
      margin-bottom: 1.25rem;
      box-shadow: var(--shadow-card);
    }

    .section-number {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--color-primary-light);
      color: var(--color-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1rem;
      flex-shrink: 0;
    }

    .section-content { flex: 1; }
    .section-label { font-weight: 800; margin-bottom: 1rem; }

    .invalid-feedback { color: var(--color-danger); font-size: 0.8rem; margin-top: 0.25rem; }

    /* Payment Card */
    .payment-demo-card {
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
    }

    .payment-demo-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .payment-lock {
      font-size: 0.8rem;
      color: #15803d;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .payment-icons { font-size: 1.25rem; color: var(--color-text-muted); display: flex; gap: 0.5rem; }

    .demo-note {
      font-size: 0.78rem;
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      gap: 0.35rem;
      margin: 0;
    }

    /* Checkout Summary */
    .checkout-summary-card {
      background: white;
      border-radius: var(--radius-xl);
      padding: 1.75rem;
      box-shadow: var(--shadow-card);
      position: sticky;
      top: 90px;
    }

    .checkout-items-list {
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 1rem;
      margin-bottom: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .checkout-item {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .checkout-item-img {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-sm);
      overflow: hidden;
      position: relative;
      flex-shrink: 0;
    }

    .checkout-item-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-qty-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background: var(--color-primary);
      color: white;
      font-size: 0.65rem;
      font-weight: 700;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .checkout-item-info { flex: 1; min-width: 0; }
    .checkout-item-title {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-text);
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .checkout-item-price {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      margin: 0;
    }
    .checkout-item-total { font-size: 0.875rem; }

    .checkout-summary-rows { display: flex; flex-direction: column; gap: 0.75rem; }
    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      color: var(--color-text-muted);
    }
    .summary-total {
      display: flex;
      justify-content: space-between;
      font-weight: 800;
      font-size: 1.1rem;
      color: var(--color-text);
      margin-top: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--color-border);
    }
  `]
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public cartService: CartService,
    private authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      city: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{4,6}$/)]]
    });
  }

  ngOnInit(): void {
    // Pre-fill with user data
    const user = this.authService.currentUser();
    if (user) {
      this.checkoutForm.patchValue({
        name: user.name,
        email: user.email
      });
    }
  }

  isInvalid(field: string): boolean {
    const ctrl = this.checkoutForm.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  getError(field: string): string {
    const ctrl = this.checkoutForm.get(field);
    if (!ctrl?.errors) return '';
    if (ctrl.hasError('required')) return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    if (ctrl.hasError('email')) return 'Please enter a valid email';
    if (ctrl.hasError('pattern')) return field === 'phone' ? 'Enter a valid phone number' : `Invalid ${field}`;
    if (ctrl.hasError('minlength')) return `Too short`;
    return 'Invalid field';
  }

  getTotal(): number {
    const subtotal = this.cartService.totalPrice();
    const shipping = subtotal >= 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    return subtotal + shipping + tax;
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const userId = this.authService.getCurrentUserId()!;
    const { address, city, zipCode } = this.checkoutForm.value;

    const orderProducts: OrderProduct[] = this.cartService.items().map(item => ({
      productId: item.product.id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image
    }));

    const newOrder = {
      userId,
      products: orderProducts,
      totalPrice: this.getTotal(),
      status: 'pending' as const,
      shippingAddress: `${address}, ${city} ${zipCode}`,
      createdAt: new Date().toISOString()
    };

    this.orderService.createOrder(newOrder).subscribe({
      next: order => {
        this.cartService.clearCart();
        this.router.navigate(['/order-confirmation', order.id]);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://placehold.co/52x52/e8eaff/4a5cff?text=?';
  }
}
