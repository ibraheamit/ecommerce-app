import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page animate-fadeIn">
      <div class="admin-page-header">
        <div>
          <h1 class="admin-page-title">Manage Orders</h1>
          <p class="admin-page-subtitle">{{ orders.length }} orders total</p>
        </div>
        <div class="header-stats">
          <div class="header-stat">
            <span class="header-stat-num">{{ getPendingCount() }}</span>
            <span class="header-stat-label">Pending</span>
          </div>
          <div class="header-stat">
            <span class="header-stat-num">{{ getCompletedCount() }}</span>
            <span class="header-stat-label">Completed</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="admin-table-card">
        <div class="table-toolbar">
          <select class="admin-select" [(ngModel)]="statusFilter" (ngModelChange)="filterOrders()">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        @if (isLoading) {
          <div class="text-center py-4">
            <div class="spinner-border" style="color: var(--admin-accent);" role="status"></div>
          </div>
        } @else {
          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Products</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                @for (order of filteredOrders; track order.id) {
                  <tr>
                    <td>
                      <span class="order-id-badge">#{{ formatOrderId(order.id) }}</span>
                    </td>
                    <td>
                      <div class="user-cell">
                        <div class="user-avatar-sm">U{{ order.userId }}</div>
                        <span>User #{{ order.userId }}</span>
                      </div>
                    </td>
                    <td>
                      <div class="order-products-preview">
                        @for (item of order.products.slice(0, 2); track item.productId) {
                          <img [src]="item.image" [alt]="item.title" class="order-thumb"
                               (error)="onImageError($event)"/>
                        }
                        @if (order.products.length > 2) {
                          <span class="more-badge">+{{ order.products.length - 2 }}</span>
                        }
                        <span class="products-count">{{ order.products.length }} item{{ order.products.length !== 1 ? 's' : '' }}</span>
                      </div>
                    </td>
                    <td class="fw-700" style="color: var(--admin-accent);">
                      \${{ order.totalPrice | number:'1.2-2' }}
                    </td>
                    <td>
                      <span class="badge-custom" [class]="getStatusClass(order.status)">
                        {{ order.status }}
                      </span>
                    </td>
                    <td style="color: #64748b; font-size: 0.8rem;">
                      {{ order.createdAt | date:'mediumDate' }}
                    </td>
                    <td>
                      <select
                        class="admin-select-sm"
                        [value]="order.status"
                        (change)="updateStatus(order, $event)"
                        [attr.aria-label]="'Update status for order ' + order.id"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .admin-page { color: #e2e8f0; }
    .admin-page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .admin-page-title { font-size: 1.75rem; font-weight: 800; color: white; margin: 0; }
    .admin-page-subtitle { color: #64748b; margin: 0.25rem 0 0; font-size: 0.875rem; }

    .header-stats { display: flex; gap: 1.5rem; }
    .header-stat { display: flex; flex-direction: column; align-items: center; }
    .header-stat-num { font-size: 1.5rem; font-weight: 800; color: white; }
    .header-stat-label { font-size: 0.75rem; color: #64748b; }

    .admin-table-card {
      background: var(--admin-card);
      border-radius: var(--radius-xl);
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.06);
    }

    .table-toolbar {
      padding: 1rem 1.25rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }

    .admin-select, .admin-select-sm {
      padding: 0.55rem 0.75rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: var(--radius-md);
      color: white;
      font-size: 0.875rem;
      font-family: var(--font-family);
      cursor: pointer;
    }
    .admin-select-sm { padding: 0.4rem 0.6rem; font-size: 0.8rem; }
    .admin-select:focus, .admin-select-sm:focus { outline: none; border-color: var(--admin-accent); }
    .admin-select option, .admin-select-sm option { background: #1e293b; }

    .admin-table-wrap { overflow-x: auto; }
    .admin-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }

    .admin-table th {
      color: #64748b;
      font-weight: 700;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 0.75rem 1.25rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      text-align: left;
    }

    .admin-table td {
      padding: 0.85rem 1.25rem;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      color: #e2e8f0;
    }

    .admin-table tr:hover td { background: rgba(255,255,255,0.02); }

    .order-id-badge { font-weight: 700; color: var(--admin-accent); font-family: monospace; }

    .user-cell { display: flex; align-items: center; gap: 0.6rem; }
    .user-avatar-sm {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(74,92,255,0.2);
      color: #818cf8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .order-products-preview { display: flex; align-items: center; gap: 0.35rem; flex-wrap: wrap; }
    .order-thumb { width: 36px; height: 36px; border-radius: var(--radius-sm); object-fit: cover; }
    .more-badge {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      background: rgba(255,255,255,0.08);
      color: #9ca3af;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 700;
    }
    .products-count { font-size: 0.8rem; color: #64748b; margin-left: 0.25rem; }
  `]
})
export class ManageOrdersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  isLoading = true;
  statusFilter = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.getAllOrders().subscribe({
      next: orders => {
        this.orders = orders;
        this.filteredOrders = orders;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false)
    });
  }

  filterOrders(): void {
    if (!this.statusFilter) {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === this.statusFilter);
    }
  }

  updateStatus(order: Order, event: Event): void {
    const status = (event.target as HTMLSelectElement).value;
    if (!order.id) return;
    this.orderService.updateOrderStatus(order.id, status).subscribe({
      next: updated => {
        order.status = updated.status;
      }
    });
  }

  getPendingCount(): number {
    return this.orders.filter(o => o.status === 'pending').length;
  }

  getCompletedCount(): number {
    return this.orders.filter(o => o.status === 'completed').length;
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
   * Safely formats an order ID. id is optional on the Order model
   * because json-server assigns it server-side after creation.
   */
  formatOrderId(id: string | undefined): string {
    if (id === undefined) return '----';
    return id.toString().padStart(4, '0');
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://placehold.co/36x36/1e293b/818cf8?text=?';
  }
}
