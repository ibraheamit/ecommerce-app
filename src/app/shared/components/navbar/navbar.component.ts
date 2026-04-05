import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar-custom" [class.scrolled]="isScrolled">
      <div class="container">
        <div class="navbar-inner">
          <!-- Brand Logo -->
          <a routerLink="/" class="brand">
            <div class="brand-icon">
              <i class="bi bi-bag-heart-fill"></i>
            </div>
            <span class="brand-name">ShopWave</span>
          </a>

          <!-- Desktop Navigation -->
          <ul class="nav-links d-none d-lg-flex">
            <li>
              <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link-item">
                Home
              </a>
            </li>
            <li>
              <a routerLink="/products" routerLinkActive="active" class="nav-link-item">
                Products
              </a>
            </li>
            @if (authService.isLoggedIn()) {
              <li>
                <a routerLink="/favorites" routerLinkActive="active" class="nav-link-item">
                  Favorites
                </a>
              </li>
            }
            @if (authService.isAdmin()) {
              <li>
                <a routerLink="/admin" routerLinkActive="active" class="nav-link-item admin-link">
                  <i class="bi bi-shield-check"></i> Admin
                </a>
              </li>
            }
          </ul>

          <!-- Desktop Right Section -->
          <div class="nav-actions d-none d-lg-flex">
            <!-- Favorites Icon -->
            @if (authService.isLoggedIn()) {
              <a routerLink="/favorites" class="action-btn" aria-label="Favorites">
                <i class="bi bi-heart"></i>
                @if (favoritesService.favoriteCount() > 0) {
                  <span class="action-badge fav-badge">{{ favoritesService.favoriteCount() }}</span>
                }
              </a>
            }

            <!-- Cart Icon -->
            <a routerLink="/cart" class="action-btn cart-btn" aria-label="Shopping Cart">
              <i class="bi bi-bag"></i>
              @if (cartService.totalItems() > 0) {
                <span class="action-badge">{{ cartService.totalItems() }}</span>
              }
            </a>

            <!-- Auth Buttons -->
            @if (!authService.isLoggedIn()) {
              <a routerLink="/auth/login" class="btn btn-outline-primary btn-sm">
                Sign In
              </a>
              <a routerLink="/auth/register" class="btn btn-primary btn-sm">
                Get Started
              </a>
            } @else {
              <!-- User Menu -->
              <div class="user-menu" (click)="toggleUserDropdown()">
                <div class="user-avatar" aria-label="User menu" aria-haspopup="true" [attr.aria-expanded]="showUserDropdown">
                  {{ authService.userName().charAt(0).toUpperCase() }}
                </div>
                @if (showUserDropdown) {
                  <div class="user-dropdown" role="menu">
                    <div class="user-dropdown-header">
                      <p class="user-dropdown-name">{{ authService.userName() }}</p>
                      <p class="user-dropdown-email">{{ authService.currentUser()?.email }}</p>
                    </div>
                    <a routerLink="/profile" class="dropdown-item-custom" role="menuitem">
                      <i class="bi bi-person"></i> My Profile
                    </a>
                    <a routerLink="/profile" class="dropdown-item-custom" role="menuitem">
                      <i class="bi bi-bag-check"></i> My Orders
                    </a>
                    @if (authService.isAdmin()) {
                      <a routerLink="/admin" class="dropdown-item-custom" role="menuitem">
                        <i class="bi bi-shield-check"></i> Admin Panel
                      </a>
                    }
                    <hr class="dropdown-divider">
                    <button class="dropdown-item-custom logout-btn" (click)="logout()" role="menuitem">
                      <i class="bi bi-box-arrow-right"></i> Sign Out
                    </button>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Mobile Menu Toggle -->
          <div class="mobile-actions">
            <a routerLink="/cart" class="action-btn" aria-label="Cart">
              <i class="bi bi-bag"></i>
              @if (cartService.totalItems() > 0) {
                <span class="action-badge">{{ cartService.totalItems() }}</span>
              }
            </a>
            <button class="hamburger" (click)="toggleMobileMenu()" aria-label="Toggle menu" [attr.aria-expanded]="showMobileMenu">
              <span [class.open]="showMobileMenu"></span>
              <span [class.open]="showMobileMenu"></span>
              <span [class.open]="showMobileMenu"></span>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      @if (showMobileMenu) {
        <div class="mobile-menu animate-fadeIn">
          <div class="container">
            <a routerLink="/" class="mobile-link" (click)="closeMobileMenu()">Home</a>
            <a routerLink="/products" class="mobile-link" (click)="closeMobileMenu()">Products</a>
            @if (authService.isLoggedIn()) {
              <a routerLink="/favorites" class="mobile-link" (click)="closeMobileMenu()">
                <i class="bi bi-heart"></i> Favorites
                @if (favoritesService.favoriteCount() > 0) {
                  <span class="ms-1 badge-custom badge-primary">{{ favoritesService.favoriteCount() }}</span>
                }
              </a>
              <a routerLink="/profile" class="mobile-link" (click)="closeMobileMenu()">
                <i class="bi bi-person"></i> Profile
              </a>
              <a routerLink="/cart" class="mobile-link" (click)="closeMobileMenu()">
                <i class="bi bi-bag"></i> Cart ({{ cartService.totalItems() }})
              </a>
              @if (authService.isAdmin()) {
                <a routerLink="/admin" class="mobile-link admin-link" (click)="closeMobileMenu()">
                  <i class="bi bi-shield-check"></i> Admin
                </a>
              }
              <button class="mobile-link logout-btn w-100 text-start" (click)="logout()">
                <i class="bi bi-box-arrow-right"></i> Sign Out
              </button>
            } @else {
              <a routerLink="/auth/login" class="mobile-link" (click)="closeMobileMenu()">Sign In</a>
              <a routerLink="/auth/register" class="btn btn-primary w-100 mt-2" (click)="closeMobileMenu()">Get Started</a>
            }
          </div>
        </div>
      }
    </nav>
  `,
  styles: [`
    .navbar-custom {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: rgba(253, 249, 243, 0.9);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid transparent;
      transition: all 0.3s ease;
      padding: 0;
    }

    .navbar-custom.scrolled {
      background: rgba(253, 249, 243, 0.98);
      border-bottom-color: var(--color-border);
      box-shadow: 0 2px 20px rgba(0,0,0,0.06);
    }

    .navbar-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 70px;
      gap: 1.5rem;
    }

    /* Brand */
    .brand {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      text-decoration: none;
    }

    .brand-icon {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, var(--color-primary), #7c3aed);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      color: white;
    }

    .brand-name {
      font-size: 1.3rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--color-primary), #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Nav Links */
    .nav-links {
      list-style: none;
      display: flex;
      gap: 0.25rem;
      margin: 0;
      padding: 0;
    }

    .nav-link-item {
      padding: 0.5rem 0.85rem;
      border-radius: var(--radius-md);
      color: var(--color-text-muted);
      font-weight: 500;
      font-size: 0.95rem;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .nav-link-item:hover {
      color: var(--color-primary);
      background: var(--color-primary-light);
    }

    .nav-link-item.active {
      color: var(--color-primary);
      background: var(--color-primary-light);
      font-weight: 600;
    }

    .admin-link {
      color: #7c3aed;
    }

    /* Right Actions */
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .action-btn {
      position: relative;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-muted);
      font-size: 1.15rem;
      transition: all 0.2s ease;
      text-decoration: none;
      cursor: pointer;
    }

    .action-btn:hover {
      background: var(--color-primary-light);
      color: var(--color-primary);
    }

    .action-badge {
      position: absolute;
      top: 4px;
      right: 4px;
      background: var(--color-primary);
      color: white;
      font-size: 0.65rem;
      font-weight: 700;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: bounce-in 0.3s ease;
    }

    .fav-badge {
      background: var(--color-accent);
    }

    /* User Menu */
    .user-menu {
      position: relative;
      cursor: pointer;
    }

    .user-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--color-primary), #7c3aed);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.95rem;
      transition: all 0.2s ease;
    }

    .user-avatar:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(74, 92, 255, 0.3);
    }

    .user-dropdown {
      position: absolute;
      top: calc(100% + 12px);
      right: 0;
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
      min-width: 220px;
      padding: 0.5rem;
      border: 1px solid var(--color-border);
      animation: fadeInUp 0.2s ease;
    }

    .user-dropdown-header {
      padding: 0.75rem;
      border-bottom: 1px solid var(--color-border);
      margin-bottom: 0.5rem;
    }

    .user-dropdown-name {
      font-weight: 700;
      font-size: 0.9rem;
      color: var(--color-text);
      margin: 0;
    }

    .user-dropdown-email {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      margin: 0;
    }

    .dropdown-item-custom {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.6rem 0.75rem;
      border-radius: var(--radius-sm);
      color: var(--color-text);
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.15s ease;
      width: 100%;
      background: none;
      border: none;
      cursor: pointer;
    }

    .dropdown-item-custom:hover {
      background: var(--color-primary-light);
      color: var(--color-primary);
    }

    .dropdown-divider {
      border-color: var(--color-border);
      margin: 0.4rem 0;
    }

    .logout-btn {
      color: var(--color-danger);
    }

    .logout-btn:hover {
      background: #fee2e2;
      color: var(--color-danger);
    }

    /* Hamburger */
    .mobile-actions {
      display: none;
      align-items: center;
      gap: 0.5rem;
    }

    .hamburger {
      background: none;
      border: none;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 5px;
    }

    .hamburger span {
      display: block;
      width: 24px;
      height: 2px;
      background: var(--color-text);
      border-radius: 2px;
      transition: all 0.3s ease;
    }

    .hamburger span.open:nth-child(1) {
      transform: rotate(45deg) translate(4px, 4px);
    }

    .hamburger span.open:nth-child(2) {
      opacity: 0;
    }

    .hamburger span.open:nth-child(3) {
      transform: rotate(-45deg) translate(4px, -4px);
    }

    /* Mobile Menu */
    .mobile-menu {
      background: white;
      border-top: 1px solid var(--color-border);
      padding: 1rem 0;
    }

    .mobile-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 0;
      color: var(--color-text);
      font-weight: 500;
      text-decoration: none;
      border-bottom: 1px solid var(--color-border-light);
      transition: color 0.2s ease;
      background: none;
      border-left: none;
      border-right: none;
      border-top: none;
      cursor: pointer;
      font-size: 1rem;
      font-family: var(--font-family);
    }

    .mobile-link:last-child {
      border-bottom: none;
    }

    .mobile-link:hover {
      color: var(--color-primary);
    }

    @media (max-width: 991px) {
      .mobile-actions {
        display: flex;
      }
    }
  `]
})
export class NavbarComponent {
  isScrolled = false;
  showMobileMenu = false;
  showUserDropdown = false;

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    public favoritesService: FavoritesService
  ) {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.showUserDropdown = false;
    }
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
  }

  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
  }

  logout(): void {
    this.showMobileMenu = false;
    this.showUserDropdown = false;
    this.authService.logout();
  }
}
