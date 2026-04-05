import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart-item.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-page" style="padding-top: 70px;">
      <!-- Page Header -->
      <div class="page-header">
        <div class="container">
          <h1 class="page-title">Shopping Cart</h1>
          <p class="page-subtitle">
            {{ cartService.totalItems() }} item{{ cartService.totalItems() !== 1 ? 's' : '' }} in your cart
          </p>
        </div>
      </div>

      <div class="container py-4">
        @if (cartService.items().length === 0) {
          <!-- Empty Cart -->
          <div class="empty-cart">
            <div class="empty-cart-icon">
              <i class="bi bi-bag-x"></i>
            </div>
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything yet. Let's fix that!</p>
            <a routerLink="/products" class="btn btn-primary btn-lg">
              <i class="bi bi-bag-heart"></i> Start Shopping
            </a>
          </div>
        } @else {
          <div class="row g-4">
            <!-- Cart Items -->
            <div class="col-lg-8">
              <div class="cart-items-card">
                <div class="cart-items-header">
                  <h5 class="mb-0">Cart Items</h5>
                  <button class="btn-clear-cart" (click)="clearCart()" aria-label="Clear all items from cart">
                    <i class="bi bi-trash"></i> Clear All
                  </button>
                </div>

                <div class="cart-items-list">
                  @for (item of cartService.items(); track item.product.id) {
                    <div class="cart-item animate-fadeIn" [class.removing]="removingId === item.product.id">
                      <!-- Product Image -->
                      <div class="cart-item-image">
                        <img
                          [src]="item.product.image"
                          [alt]="item.product.title"
                          loading="lazy"
                          (error)="onImageError($event)"
                        />
                      </div>

                      <!-- Product Info -->
                      <div class="cart-item-info">
                        <span class="cart-item-category">{{ item.product.category }}</span>
                        <h6 class="cart-item-title">{{ item.product.title }}</h6>
                        <p class="cart-item-price">\${{ item.product.price | number:'1.2-2' }}</p>
                      </div>

                      <!-- Quantity Control -->
                      <div class="cart-item-qty">
                        <div class="qty-control" role="group" [attr.aria-label]="'Quantity for ' + item.product.title">
                          <button
                            class="qty-btn"
                            (click)="decrement(item)"
                            [attr.aria-label]="'Decrease quantity of ' + item.product.title"
                          >−</button>
                          <span class="qty-value" [attr.aria-live]="'polite'">{{ item.quantity }}</span>
                          <button
                            class="qty-btn"
                            (click)="increment(item)"
                            [attr.aria-label]="'Increase quantity of ' + item.product.title"
                          >+</button>
                        </div>
                      </div>

                      <!-- Item Total -->
                      <div class="cart-item-total">
                        <span>\${{ (item.product.price * item.quantity) | number:'1.2-2' }}</span>
                      </div>

                      <!-- Remove Button -->
                      <button
                        class="cart-item-remove"
                        (click)="removeItem(item)"
                        [attr.aria-label]="'Remove ' + item.product.title + ' from cart'"
                      >
                        <i class="bi bi-x-lg"></i>
                      </button>
                    </div>
                  }
                </div>
              </div>

              <!-- Continue Shopping -->
              <div class="mt-3">
                <a routerLink="/products" class="btn btn-outline-primary">
                  <i class="bi bi-arrow-left"></i> Continue Shopping
                </a>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="col-lg-4">
              <div class="order-summary-card">
                <h5 class="summary-title">Order Summary</h5>

                <div class="summary-row">
                  <span>Subtotal ({{ cartService.totalItems() }} items)</span>
                  <span>\${{ cartService.totalPrice() | number:'1.2-2' }}</span>
                </div>
                <div class="summary-row">
                  <span>Shipping</span>
                  <span class="text-success fw-600">
                    {{ cartService.totalPrice() >= 50 ? 'FREE' : '$9.99' }}
                  </span>
                </div>
                <div class="summary-row">
                  <span>Tax (8%)</span>
                  <span>\${{ cartService.totalPrice() * 0.08 | number:'1.2-2' }}</span>
                </div>

                @if (cartService.totalPrice() < 50) {
                  <div class="free-shipping-bar">
                    <p>Add <strong>\${{ (50 - cartService.totalPrice()) | number:'1.2-2' }}</strong> more for FREE shipping!</p>
                    <div class="shipping-progress">
                      <div
                        class="shipping-progress-fill"
                        [style.width.%]="(cartService.totalPrice() / 50) * 100"
                      ></div>
                    </div>
                  </div>
                }

                <div class="summary-divider"></div>

                <div class="summary-total">
                  <span>Total</span>
                  <span class="total-price">
                    \${{ getTotal() | number:'1.2-2' }}
                  </span>
                </div>

                <a
                  routerLink="/checkout"
                  class="btn btn-primary w-100 btn-lg mt-3"
                  aria-label="Proceed to checkout"
                >
                  <i class="bi bi-lock"></i> Secure Checkout
                </a>

                <!-- Trust Badges -->
                <div class="cart-trust-badges">
                  <div class="trust-badge">
                    <i class="bi bi-shield-check"></i>
                    <span>SSL Secure</span>
                  </div>
                  <div class="trust-badge">
                    <i class="bi bi-credit-card"></i>
                    <span>All Cards</span>
                  </div>
                  <div class="trust-badge">
                    <i class="bi bi-arrow-counterclockwise"></i>
                    <span>30-Day Return</span>
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
    .cart-page {
      min-height: 100vh;
      background: var(--bg-primary);
    }

    .page-header {
      background: linear-gradient(135deg, var(--color-primary) 0%, #7c3aed 100%);
      padding: 2.5rem 0;
      color: white;
    }
    .page-title { font-size: 2rem; font-weight: 800; margin: 0; }
    .page-subtitle { margin: 0.25rem 0 0; opacity: 0.85; }

    /* Empty Cart */
    .empty-cart {
      text-align: center;
      padding: 5rem 2rem;
    }
    .empty-cart-icon {
      font-size: 5rem;
      color: var(--color-border);
      margin-bottom: 1rem;
      animation: bounce-in 0.5s ease;
    }
    .empty-cart h3 { font-weight: 800; margin-bottom: 0.5rem; }
    .empty-cart p { color: var(--color-text-muted); margin-bottom: 1.5rem; }

    /* Cart Items Card */
    .cart-items-card {
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-card);
      overflow: hidden;
    }

    .cart-items-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--color-border);
    }

    .btn-clear-cart {
      background: none;
      border: none;
      color: var(--color-danger);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0;
      font-family: var(--font-family);
      transition: opacity 0.2s;
    }
    .btn-clear-cart:hover { opacity: 0.75; }

    .cart-items-list { padding: 0.5rem 0; }

    .cart-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--color-border-light);
      transition: all 0.3s ease;
    }

    .cart-item:last-child { border-bottom: none; }
    .cart-item:hover { background: var(--bg-secondary); }

    .cart-item.removing {
      opacity: 0.4;
      transform: translateX(-20px);
    }

    .cart-item-image {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-md);
      overflow: hidden;
      flex-shrink: 0;
    }

    .cart-item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .cart-item-info { flex: 1; min-width: 0; }

    .cart-item-category {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--color-primary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .cart-item-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--color-text);
      margin: 0.25rem 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .cart-item-price {
      font-size: 0.85rem;
      color: var(--color-text-muted);
      margin: 0;
    }

    .cart-item-qty { flex-shrink: 0; }

    .cart-item-total {
      font-weight: 700;
      font-size: 1rem;
      color: var(--color-text);
      min-width: 70px;
      text-align: right;
    }

    .cart-item-remove {
      background: none;
      border: none;
      color: var(--color-text-muted);
      cursor: pointer;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .cart-item-remove:hover {
      background: #fee2e2;
      color: var(--color-danger);
    }

    /* Order Summary */
    .order-summary-card {
      background: white;
      border-radius: var(--radius-xl);
      padding: 1.75rem;
      box-shadow: var(--shadow-card);
      position: sticky;
      top: 90px;
    }

    .summary-title {
      font-weight: 800;
      margin-bottom: 1.25rem;
      font-size: 1.1rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.85rem;
      font-size: 0.9rem;
      color: var(--color-text-muted);
    }

    .summary-divider {
      height: 1px;
      background: var(--color-border);
      margin: 1rem 0;
    }

    .summary-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 800;
      font-size: 1.1rem;
      color: var(--color-text);
    }

    .total-price { color: var(--color-primary); font-size: 1.3rem; }

    .free-shipping-bar {
      background: #dcfce7;
      border-radius: var(--radius-md);
      padding: 0.75rem;
      margin: 0.75rem 0;
    }

    .free-shipping-bar p {
      font-size: 0.8rem;
      color: #15803d;
      margin-bottom: 0.5rem;
    }

    .shipping-progress {
      height: 6px;
      background: rgba(0,0,0,0.1);
      border-radius: 3px;
      overflow: hidden;
    }

    .shipping-progress-fill {
      height: 100%;
      background: #22c55e;
      border-radius: 3px;
      transition: width 0.5s ease;
    }

    /* Trust badges in cart */
    .cart-trust-badges {
      display: flex;
      justify-content: space-around;
      margin-top: 1.25rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--color-border-light);
    }

    .trust-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.7rem;
      color: var(--color-text-muted);
      text-align: center;
    }

    .trust-badge i { font-size: 1.1rem; color: var(--color-primary); }

    @media (max-width: 768px) {
      .cart-item { flex-wrap: wrap; }
      .cart-item-total { order: 5; }
    }
  `]
})
export class CartComponent {
  removingId: string | null = null;

  constructor(public cartService: CartService) {}

  increment(item: CartItem): void {
    this.cartService.incrementQuantity(item.product.id);
  }

  decrement(item: CartItem): void {
    this.cartService.decrementQuantity(item.product.id);
  }

  removeItem(item: CartItem): void {
    this.removingId = item.product.id;
    setTimeout(() => {
      this.cartService.removeFromCart(item.product.id);
      this.removingId = null;
    }, 300);
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      this.cartService.clearCart();
    }
  }

  getTotal(): number {
    const subtotal = this.cartService.totalPrice();
    const shipping = subtotal >= 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    return subtotal + shipping + tax;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/80x80/e8eaff/4a5cff?text=?';
  }
}
