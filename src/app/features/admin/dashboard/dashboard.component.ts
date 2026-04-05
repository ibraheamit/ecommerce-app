import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-dashboard animate-fadeIn">
      <div class="admin-page-header">
        <h1 class="admin-page-title">Dashboard</h1>
        <p class="admin-page-subtitle">Welcome back! Here's what's happening today.</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon products-icon"><i class="bi bi-box-seam"></i></div>
          <div class="stat-info">
            <span class="stat-label">Total Products</span>
            <span class="stat-number">{{ stats.products }}</span>
            <span class="stat-change positive"><i class="bi bi-arrow-up"></i> 2 new this week</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon orders-icon"><i class="bi bi-receipt"></i></div>
          <div class="stat-info">
            <span class="stat-label">Total Orders</span>
            <span class="stat-number">{{ stats.orders }}</span>
            <span class="stat-change positive"><i class="bi bi-arrow-up"></i> Growing steadily</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon users-icon"><i class="bi bi-people"></i></div>
          <div class="stat-info">
            <span class="stat-label">Registered Users</span>
            <span class="stat-number">{{ stats.users }}</span>
            <span class="stat-change positive"><i class="bi bi-arrow-up"></i> Community growing</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon revenue-icon"><i class="bi bi-currency-dollar"></i></div>
          <div class="stat-info">
            <span class="stat-label">Total Revenue</span>
            <span class="stat-number">\${{ stats.revenue | number:'1.0-0' }}</span>
            <span class="stat-change positive"><i class="bi bi-arrow-up"></i> From all orders</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="admin-quick-actions">
        <h5 class="admin-section-title">Quick Actions</h5>
        <div class="quick-action-grid">
          <a routerLink="/admin/products" class="quick-action-card">
            <i class="bi bi-plus-circle"></i>
            <span>Add Product</span>
          </a>
          <a routerLink="/admin/orders" class="quick-action-card">
            <i class="bi bi-list-check"></i>
            <span>View Orders</span>
          </a>
          <a routerLink="/admin/users" class="quick-action-card">
            <i class="bi bi-people"></i>
            <span>Manage Users</span>
          </a>
          <a routerLink="/" class="quick-action-card">
            <i class="bi bi-shop"></i>
            <span>View Store</span>
          </a>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="admin-section-card">
        <div class="admin-section-header">
          <h5 class="admin-section-title mb-0">Recent Orders</h5>
          <a routerLink="/admin/orders" class="admin-link">View All <i class="bi bi-arrow-right"></i></a>
        </div>
        @if (recentOrders.length > 0) {
          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User ID</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                @for (order of recentOrders.slice(0,5); track order.id) {
                  <tr>
                    <td><span class="order-id-badge">#{{ formatOrderId(order.id) }}</span></td>
                    <td>User #{{ order.userId }}</td>
                    <td>{{ order.products.length }} items</td>
                    <td class="fw-700" style="color: var(--admin-accent);">\${{ order.totalPrice | number:'1.2-2' }}</td>
                    <td>
                      <span class="badge-custom" [class]="getStatusClass(order.status)">{{ order.status }}</span>
                    </td>
                    <td style="color: #6b7280; font-size: 0.8rem;">{{ order.createdAt | date:'mediumDate' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <p class="text-muted text-center py-3">No orders yet.</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .admin-dashboard { color: #e2e8f0; }

    .admin-page-header { margin-bottom: 2rem; }
    .admin-page-title { font-size: 1.75rem; font-weight: 800; color: white; margin: 0; }
    .admin-page-subtitle { color: #64748b; margin: 0.25rem 0 0; }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--admin-card);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      border: 1px solid rgba(255,255,255,0.06);
      transition: transform 0.2s;
    }

    .stat-card:hover { transform: translateY(-2px); }

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    .products-icon { background: rgba(74,92,255,0.15); color: #818cf8; }
    .orders-icon { background: rgba(245,158,11,0.15); color: #fbbf24; }
    .users-icon { background: rgba(34,197,94,0.15); color: #4ade80; }
    .revenue-icon { background: rgba(239,68,68,0.15); color: #f87171; }

    .stat-info { display: flex; flex-direction: column; gap: 0.2rem; }
    .stat-label { font-size: 0.8rem; color: #64748b; font-weight: 600; }
    .stat-number { font-size: 1.75rem; font-weight: 800; color: white; line-height: 1; }
    .stat-change { font-size: 0.75rem; color: #4ade80; display: flex; align-items: center; gap: 0.25rem; }

    /* Quick Actions */
    .admin-quick-actions { margin-bottom: 2rem; }
    .admin-section-title { color: white; font-weight: 700; margin-bottom: 1rem; font-size: 1rem; }

    .quick-action-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .quick-action-card {
      background: var(--admin-card);
      border-radius: var(--radius-lg);
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.6rem;
      color: #9ca3af;
      text-decoration: none;
      border: 1px solid rgba(255,255,255,0.06);
      transition: all 0.2s;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .quick-action-card i { font-size: 1.5rem; color: var(--admin-accent); }
    .quick-action-card:hover { background: rgba(74,92,255,0.1); color: white; transform: translateY(-2px); }

    /* Table */
    .admin-section-card {
      background: var(--admin-card);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      border: 1px solid rgba(255,255,255,0.06);
    }

    .admin-section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }

    .admin-link { color: var(--admin-accent); font-size: 0.875rem; font-weight: 600; text-decoration: none; }
    .admin-link:hover { color: #818cf8; }

    .admin-table-wrap { overflow-x: auto; }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }

    .admin-table th {
      color: #64748b;
      font-weight: 700;
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      text-align: left;
    }

    .admin-table td {
      padding: 0.85rem 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      color: #e2e8f0;
    }

    .admin-table tr:hover td { background: rgba(255,255,255,0.02); }

    .order-id-badge {
      font-weight: 700;
      color: var(--admin-accent);
      font-family: monospace;
    }

    @media (max-width: 992px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .quick-action-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 576px) {
      .stats-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats = { products: 0, orders: 0, users: 0, revenue: 0 };
  recentOrders: Order[] = [];

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    forkJoin({
      products: this.productService.getProducts(),
      orders: this.orderService.getAllOrders(),
      users: this.http.get<unknown[]>(`${environment.apiUrl}/users`)
    }).subscribe({
      next: ({ products, orders, users }) => {
        this.stats.products = products.length;
        this.stats.orders = orders.length;
        this.stats.users = users.length;
        this.stats.revenue = orders.reduce((sum, o) => sum + (o as { totalPrice: number }).totalPrice, 0);
        this.recentOrders = orders;
      }
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'badge-warning',
      processing: 'badge-primary',
      completed: 'badge-success',
      cancelled: 'badge-danger'
    };
    return map[status] ?? 'badge-primary';
  }

  /**
   * Safely formats an order ID. id is optional because json-server
   * assigns it server-side; we never show a misleading '0000'.
   */
  formatOrderId(id: string | undefined): string {
    if (id === undefined) return '----';
    return id.toString().padStart(4, '0');
  }
}
