import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="profile-page" style="padding-top: 70px;">
      <div class="profile-header">
        <div class="container">
          <div class="profile-header-inner">
            <div class="avatar-large">
              {{ authService.userName().charAt(0).toUpperCase() }}
            </div>
            <div class="profile-header-info">
              <h1>{{ authService.userName() }}</h1>
              <p><i class="bi bi-envelope"></i> {{ authService.currentUser()?.email }}</p>
              <span class="badge-custom" [class]="authService.isAdmin() ? 'badge-primary' : 'badge-success'">
                <i [class]="authService.isAdmin() ? 'bi bi-shield-check' : 'bi bi-person-check'"></i>
                {{ authService.isAdmin() ? 'Admin' : 'Member' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="container py-4">
        <div class="row g-4">
          <!-- Sidebar -->
          <div class="col-lg-3">
            <div class="profile-sidebar">
              <nav class="profile-nav">
                <button class="profile-nav-btn" [class.active]="activeTab === 'orders'" (click)="activeTab = 'orders'">
                  <i class="bi bi-bag-check"></i> My Orders
                  @if (orders.length > 0) {
                    <span class="nav-badge">{{ orders.length }}</span>
                  }
                </button>
                <button class="profile-nav-btn" [class.active]="activeTab === 'info'" (click)="activeTab = 'info'">
                  <i class="bi bi-person"></i> Account Info
                </button>
                <a routerLink="/favorites" class="profile-nav-btn">
                  <i class="bi bi-heart"></i> My Favorites
                </a>
                @if (authService.isAdmin()) {
                  <a routerLink="/admin" class="profile-nav-btn admin-btn">
                    <i class="bi bi-shield-check"></i> Admin Panel
                  </a>
                }
              </nav>
            </div>
          </div>

          <!-- Main Content -->
          <div class="col-lg-9">
            <!-- Orders Tab -->
            @if (activeTab === 'orders') {
              <div class="profile-content-card">
                <h5 class="fw-800 mb-3">My Orders</h5>
                @if (isLoading) {
                  <div class="text-center py-4">
                    <div class="spinner-border text-primary" role="status"></div>
                  </div>
                } @else if (orders.length === 0) {
                  <div class="empty-state">
                    <i class="bi bi-bag-x" style="font-size:3.5rem; color: var(--color-border);"></i>
                    <h5 class="mt-3">No orders yet</h5>
                    <p class="text-muted">You haven't placed any orders yet.</p>
                    <a routerLink="/products" class="btn btn-primary">Start Shopping</a>
                  </div>
                } @else {
                  <div class="orders-list">
                    @for (order of orders; track order.id) {
                      <div class="order-card">
                        <div class="order-card-header">
                          <div>
                            <span class="order-id">#{{ formatOrderId(order.id) }}</span>
                            <span class="order-date">{{ order.createdAt | date:'mediumDate' }}</span>
                          </div>
                          <span class="badge-custom" [class]="getStatusBadge(order.status)">
                            {{ order.status }}
                          </span>
                        </div>

                        <div class="order-items-preview">
                          @for (item of order.products.slice(0, 3); track item.productId) {
                            <img
                              [src]="item.image"
                              [alt]="item.title"
                              class="order-item-thumb"
                              loading="lazy"
                              (error)="onImageError($event)"
                            />
                          }
                          @if (order.products.length > 3) {
                            <div class="order-item-more">+{{ order.products.length - 3 }}</div>
                          }
                          <div class="order-items-info">
                            <p class="mb-0 fw-600">
                              {{ order.products.length }} item{{ order.products.length !== 1 ? 's' : '' }}
                            </p>
                            <p class="text-muted mb-0" style="font-size: 0.8rem;">
                              {{ getOrderProductNames(order) | slice:0:60 }}...
                            </p>
                          </div>
                        </div>

                        <div class="order-card-footer">
                          <div class="shipping-address">
                            <i class="bi bi-geo-alt"></i> {{ order.shippingAddress }}
                          </div>
                          <span class="order-total">\${{ order.totalPrice | number:'1.2-2' }}</span>
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            }

            <!-- Account Info Tab -->
            @if (activeTab === 'info') {
              <div class="profile-content-card">
                <h5 class="fw-800 mb-4">Account Information</h5>
                <div class="info-grid">
                  <div class="info-item">
                    <label class="info-label"><i class="bi bi-person"></i> Full Name</label>
                    <p class="info-value">{{ authService.userName() }}</p>
                  </div>
                  <div class="info-item">
                    <label class="info-label"><i class="bi bi-envelope"></i> Email</label>
                    <p class="info-value">{{ authService.currentUser()?.email }}</p>
                  </div>
                  <div class="info-item">
                    <label class="info-label"><i class="bi bi-person-badge"></i> Role</label>
                    <p class="info-value">{{ authService.currentUser()?.role | titlecase }}</p>
                  </div>
                  <div class="info-item">
                    <label class="info-label"><i class="bi bi-bag-check"></i> Total Orders</label>
                    <p class="info-value">{{ orders.length }}</p>
                  </div>
                </div>

                <div class="mt-4">
                  <button class="btn btn-outline-primary me-2">
                    <i class="bi bi-pencil"></i> Edit Profile
                  </button>
                  <button class="btn btn-outline-primary me-2">
                    <i class="bi bi-shield-lock"></i> Change Password
                  </button>
                  <button class="btn btn-outline-danger" (click)="logout()">
                    <i class="bi bi-box-arrow-right"></i> Sign Out
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page { min-height: 100vh; background: var(--bg-primary); }

    .profile-header {
      background: linear-gradient(135deg, var(--color-primary) 0%, #7c3aed 100%);
      padding: 3rem 0;
      color: white;
    }

    .profile-header-inner {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .avatar-large {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2.5rem;
      font-weight: 800;
      border: 3px solid rgba(255,255,255,0.4);
      flex-shrink: 0;
    }

    .profile-header-info h1 { font-size: 1.75rem; font-weight: 800; margin: 0 0 0.25rem; }
    .profile-header-info p { opacity: 0.9; margin: 0 0 0.5rem; display: flex; align-items: center; gap: 0.4rem; }

    /* Sidebar */
    .profile-sidebar {
      background: white;
      border-radius: var(--radius-xl);
      padding: 1rem;
      box-shadow: var(--shadow-card);
    }

    .profile-nav { display: flex; flex-direction: column; gap: 0.25rem; }

    .profile-nav-btn {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.7rem 0.85rem;
      border-radius: var(--radius-md);
      background: none;
      border: none;
      color: var(--color-text-muted);
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      text-align: left;
      font-family: var(--font-family);
      text-decoration: none;
      transition: all 0.2s;
    }

    .profile-nav-btn:hover { background: var(--color-primary-light); color: var(--color-primary); }
    .profile-nav-btn.active { background: var(--color-primary-light); color: var(--color-primary); font-weight: 700; }
    .profile-nav-btn.admin-btn { color: #7c3aed; }
    .profile-nav-btn.admin-btn:hover { background: #f3e8ff; }

    .nav-badge {
      margin-left: auto;
      background: var(--color-primary);
      color: white;
      font-size: 0.7rem;
      padding: 0.1rem 0.45rem;
      border-radius: var(--radius-full);
      font-weight: 700;
    }

    /* Content Card */
    .profile-content-card {
      background: white;
      border-radius: var(--radius-xl);
      padding: 1.75rem;
      box-shadow: var(--shadow-card);
    }

    /* Orders */
    .orders-list { display: flex; flex-direction: column; gap: 1rem; }

    .order-card {
      border: 2px solid var(--color-border-light);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
      transition: border-color 0.2s;
    }

    .order-card:hover { border-color: var(--color-primary); }

    .order-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .order-id { font-weight: 800; font-size: 1rem; color: var(--color-text); margin-right: 0.75rem; }
    .order-date { font-size: 0.8rem; color: var(--color-text-muted); }

    .order-items-preview {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.85rem;
      flex-wrap: wrap;
    }

    .order-item-thumb {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-sm);
      object-fit: cover;
    }

    .order-item-more {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-sm);
      background: var(--color-primary-light);
      color: var(--color-primary);
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .order-items-info { flex: 1; }

    .order-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 0.75rem;
      border-top: 1px solid var(--color-border-light);
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .shipping-address { font-size: 0.8rem; color: var(--color-text-muted); display: flex; align-items: center; gap: 0.35rem; }
    .order-total { font-weight: 800; color: var(--color-primary); font-size: 1rem; }

    /* Info Grid */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }

    .info-item {
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      padding: 1rem;
    }

    .info-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      margin-bottom: 0.35rem;
    }

    .info-value { font-size: 1rem; font-weight: 600; color: var(--color-text); margin: 0; }

    @media (max-width: 576px) {
      .info-grid { grid-template-columns: 1fr; }
      .profile-header-inner { flex-direction: column; text-align: center; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  activeTab = 'orders';
  orders: Order[] = [];
  isLoading = true;

  constructor(
    public authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.orderService.getOrdersByUser(userId).subscribe({
        next: orders => {
          this.orders = orders;
          this.isLoading = false;
        },
        error: () => (this.isLoading = false)
      });
    }
  }

  /**
   * Returns the CSS badge class for a given order status.
   */
  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      pending: 'badge-warning',
      processing: 'badge-primary',
      completed: 'badge-success',
      cancelled: 'badge-danger'
    };
    return map[status] ?? 'badge-primary';
  }

  /**
   * Safely formats an order ID. The id field is optional on the Order model
   * because json-server assigns it server-side after creation.
   */
  formatOrderId(id: string | undefined): string {
    if (id === undefined) return '------';
    return id.toString().padStart(6, '0');
  }

  logout(): void {
    this.authService.logout();
  }

  getOrderProductNames(order: Order): string {
    return order.products.map(p => p.title).join(', ');
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://placehold.co/44x44/e8eaff/4a5cff?text=?';
  }
}
