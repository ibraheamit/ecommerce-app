import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-layout" style="padding-top: 70px;">
      <!-- Admin Sidebar -->
      <aside class="admin-sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="sidebar-header">
          @if (!sidebarCollapsed) {
            <div class="sidebar-brand">
              <i class="bi bi-shield-check"></i>
              <span>Admin Panel</span>
            </div>
          }
          <button class="sidebar-toggle" (click)="sidebarCollapsed = !sidebarCollapsed" aria-label="Toggle sidebar">
            <i [class]="sidebarCollapsed ? 'bi bi-layout-sidebar' : 'bi bi-layout-sidebar-reverse'"></i>
          </button>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-group">
            @if (!sidebarCollapsed) {
              <span class="nav-group-label">MAIN</span>
            }
            <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}"
               class="sidebar-link" [attr.title]="sidebarCollapsed ? 'Dashboard' : null">
              <i class="bi bi-grid-1x2"></i>
              @if (!sidebarCollapsed) { <span>Dashboard</span> }
            </a>
          </div>

          <div class="nav-group">
            @if (!sidebarCollapsed) {
              <span class="nav-group-label">MANAGE</span>
            }
            <a routerLink="/admin/products" routerLinkActive="active"
               class="sidebar-link" [attr.title]="sidebarCollapsed ? 'Products' : null">
              <i class="bi bi-box-seam"></i>
              @if (!sidebarCollapsed) { <span>Products</span> }
            </a>
            <a routerLink="/admin/orders" routerLinkActive="active"
               class="sidebar-link" [attr.title]="sidebarCollapsed ? 'Orders' : null">
              <i class="bi bi-receipt"></i>
              @if (!sidebarCollapsed) { <span>Orders</span> }
            </a>
            <a routerLink="/admin/users" routerLinkActive="active"
               class="sidebar-link" [attr.title]="sidebarCollapsed ? 'Users' : null">
              <i class="bi bi-people"></i>
              @if (!sidebarCollapsed) { <span>Users</span> }
            </a>
          </div>

          <div class="nav-group sidebar-footer-links">
            <a routerLink="/" class="sidebar-link" [attr.title]="sidebarCollapsed ? 'View Store' : null">
              <i class="bi bi-shop"></i>
              @if (!sidebarCollapsed) { <span>View Store</span> }
            </a>
            <button class="sidebar-link logout-link" (click)="logout()">
              <i class="bi bi-box-arrow-left"></i>
              @if (!sidebarCollapsed) { <span>Logout</span> }
            </button>
          </div>
        </nav>
      </aside>

      <!-- Admin Content -->
      <main class="admin-main" [class.sidebar-collapsed]="sidebarCollapsed">
        <router-outlet />
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: calc(100vh - 70px);
      background: var(--admin-bg);
    }

    /* Sidebar */
    .admin-sidebar {
      width: 240px;
      background: var(--admin-sidebar);
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
      position: fixed;
      top: 70px;
      bottom: 0;
      left: 0;
      z-index: 100;
      border-right: 1px solid rgba(255,255,255,0.06);
    }

    .admin-sidebar.collapsed { width: 64px; }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      min-height: 64px;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      color: white;
      font-weight: 700;
      font-size: 0.95rem;
    }

    .sidebar-brand i { color: var(--admin-accent); font-size: 1.1rem; }

    .sidebar-toggle {
      background: none;
      border: none;
      color: #9ca3af;
      cursor: pointer;
      font-size: 1.1rem;
      padding: 0.25rem;
      transition: color 0.2s;
      margin-left: auto;
    }
    .sidebar-toggle:hover { color: white; }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
    }

    .nav-group { margin-bottom: 0.5rem; }

    .nav-group-label {
      display: block;
      padding: 0.25rem 1rem;
      font-size: 0.65rem;
      font-weight: 700;
      color: #4b5563;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.7rem 1rem;
      color: #9ca3af;
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      border-radius: 0;
      transition: all 0.2s;
      border: none;
      background: none;
      cursor: pointer;
      width: 100%;
      text-align: left;
      font-family: var(--font-family);
      white-space: nowrap;
    }

    .sidebar-link:hover { background: rgba(255,255,255,0.05); color: white; }

    .sidebar-link.active {
      background: rgba(74,92,255,0.15);
      color: #818cf8;
      border-right: 3px solid #818cf8;
    }

    .sidebar-link i { font-size: 1rem; flex-shrink: 0; width: 20px; text-align: center; }

    .sidebar-footer-links {
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid rgba(255,255,255,0.06);
    }

    .logout-link { color: #f87171; }
    .logout-link:hover { background: rgba(248,113,113,0.1); color: #f87171; }

    /* Main content */
    .admin-main {
      flex: 1;
      margin-left: 240px;
      padding: 2rem;
      min-height: calc(100vh - 70px);
      transition: margin-left 0.3s ease;
    }

    .admin-main.sidebar-collapsed { margin-left: 64px; }

    @media (max-width: 768px) {
      .admin-sidebar { display: none; }
      .admin-main { margin-left: 0; }
    }
  `]
})
export class AdminLayoutComponent {
  sidebarCollapsed = false;

  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
