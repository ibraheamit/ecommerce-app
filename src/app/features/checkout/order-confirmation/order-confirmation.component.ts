import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="confirmation-page" style="padding-top: 70px;">
      <div class="container py-5">
        @if (order) {
          <div class="confirmation-card animate-fadeInUp">
            <!-- Success Animation -->
            <div class="success-circle">
              <div class="success-icon">
                <i class="bi bi-check-lg"></i>
              </div>
            </div>

            <h1 class="confirmation-title">Order Confirmed! 🎉</h1>
            <p class="confirmation-subtitle">
              Thank you for your order! We've received it and will start processing right away.
            </p>

            <div class="order-meta">
              <div class="meta-item">
                <span class="meta-label">Order Number</span>
                <span class="meta-value">#{{ formatOrderId(order.id) }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Date</span>
                <span class="meta-value">{{ order.createdAt | date:'mediumDate' }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Status</span>
                <span class="meta-value badge-custom badge-warning">{{ order.status }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">Total</span>
                <span class="meta-value price">\${{ order.totalPrice | number:'1.2-2' }}</span>
              </div>
            </div>

            <!-- Ordered Items -->
            <div class="ordered-items">
              <h5 class="fw-700 mb-3">Items Ordered</h5>
              <div class="ordered-items-list">
                @for (item of order.products; track item.productId) {
                  <div class="ordered-item">
                    <img [src]="item.image" [alt]="item.title" loading="lazy"
                         (error)="onImageError($event)"/>
                    <div class="item-info">
                      <p class="item-title">{{ item.title }}</p>
                      <p class="item-qty">Qty: {{ item.quantity }}</p>
                    </div>
                    <span class="item-price fw-700">\${{ (item.price * item.quantity) | number:'1.2-2' }}</span>
                  </div>
                }
              </div>
            </div>

            <div class="shipping-info">
              <i class="bi bi-truck"></i>
              <div>
                <p class="fw-700 mb-0">Shipping to:</p>
                <p class="text-muted mb-0">{{ order.shippingAddress }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="confirmation-actions">
              <a routerLink="/profile" class="btn btn-outline-primary btn-lg">
                <i class="bi bi-person"></i> View My Orders
              </a>
              <a routerLink="/products" class="btn btn-primary btn-lg">
                <i class="bi bi-bag-heart"></i> Continue Shopping
              </a>
            </div>
          </div>
        } @else if (isLoading) {
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .confirmation-page {
      min-height: 100vh;
      background: var(--bg-primary);
    }

    .confirmation-card {
      background: white;
      border-radius: var(--radius-xl);
      padding: 3rem 2rem;
      box-shadow: var(--shadow-xl);
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }

    .success-circle {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: linear-gradient(135deg, #22c55e, #16a34a);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      animation: bounce-in 0.6s ease;
      box-shadow: 0 8px 25px rgba(34, 197, 94, 0.35);
    }

    .success-icon {
      font-size: 2.5rem;
      color: white;
    }

    .confirmation-title {
      font-size: 2rem;
      font-weight: 800;
      color: var(--color-text);
      margin-bottom: 0.75rem;
    }

    .confirmation-subtitle {
      color: var(--color-text-muted);
      font-size: 1rem;
      max-width: 420px;
      margin: 0 auto 2rem;
      line-height: 1.7;
    }

    .order-meta {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
      margin-bottom: 1.75rem;
      text-align: left;
    }

    .meta-item { display: flex; flex-direction: column; gap: 0.2rem; }
    .meta-label { font-size: 0.75rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; }
    .meta-value { font-weight: 700; font-size: 0.95rem; color: var(--color-text); }

    .ordered-items { text-align: left; margin-bottom: 1.5rem; }

    .ordered-items-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-height: 250px;
      overflow-y: auto;
    }

    .ordered-item {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.75rem;
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
    }

    .ordered-item img {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-sm);
      object-fit: cover;
    }

    .item-info { flex: 1; }
    .item-title { font-size: 0.85rem; font-weight: 600; margin: 0; }
    .item-qty { font-size: 0.75rem; color: var(--color-text-muted); margin: 0; }
    .item-price { font-size: 0.9rem; }

    .shipping-info {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      background: #dcfce7;
      border-radius: var(--radius-lg);
      padding: 1rem 1.25rem;
      text-align: left;
      margin-bottom: 2rem;
    }

    .shipping-info i { font-size: 1.5rem; color: #16a34a; flex-shrink: 0; }
    .shipping-info p { font-size: 0.875rem; }

    .confirmation-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
  `]
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderService.getOrderById(id).subscribe({
        next: order => {
          this.order = order;
          this.isLoading = false;
        },
        error: () => (this.isLoading = false)
      });
    }
  }

  /**
   * Safely formats an order ID, handling the case where json-server
   * may not have assigned an ID yet (id is optional on the model).
   */
  formatOrderId(id: string | undefined): string {
    if (id === undefined) return '------';
    return id.toString().padStart(6, '0');
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://placehold.co/52x52/dcfce7/16a34a?text=✓';
  }
}
