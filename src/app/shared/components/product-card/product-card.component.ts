import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { FavoritesService } from '../../../core/services/favorites.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="product-card" [class.adding]="isAdding">
      <!-- Image Container -->
      <div class="product-image-wrap" [routerLink]="['/products', product.id]" style="cursor:pointer;" [attr.aria-label]="'View ' + product.title">
        <img
          [src]="product.image"
          [alt]="product.title"
          class="product-image"
          loading="lazy"
          (error)="onImageError($event)"
        />
        <!-- Category Badge -->
        <span class="product-category-badge">{{ product.category }}</span>

        <!-- Favorite Button -->
        <button
          class="fav-btn"
          [class.favorited]="isFavorited"
          (click)="toggleFavorite($event)"
          [attr.aria-label]="isFavorited ? 'Remove from favorites' : 'Add to favorites'"
          [attr.aria-pressed]="isFavorited"
        >
          <i [class]="isFavorited ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
        </button>

        <!-- Quick Add Overlay -->
        <div class="product-overlay">
          <button
            class="btn btn-primary btn-sm quick-add-btn"
            (click)="addToCart()"
            [disabled]="isAdding"
            aria-label="Add to cart"
          >
            @if (isAdding) {
              <i class="bi bi-check-lg"></i> Added!
            } @else {
              <i class="bi bi-bag-plus"></i> Add to Cart
            }
          </button>
        </div>
      </div>

      <!-- Product Info -->
      <div class="product-info">
        <div class="rating-row">
          <span class="star-rating" [attr.aria-label]="'Rating: ' + product.rating + ' out of 5'">
            @for (star of getStars(product.rating); track $index) {
              <i [class]="star"></i>
            }
          </span>
          <span class="rating-value">({{ product.rating }})</span>
        </div>

        <h3 class="product-title" [routerLink]="['/products', product.id]" style="cursor:pointer;">{{ product.title }}</h3>

        <p class="product-desc">{{ product.description | slice:0:75 }}...</p>

        <div class="product-footer">
          <span class="price" [attr.aria-label]="'Price: $' + product.price">
            \${{ product.price | number:'1.2-2' }}
          </span>
          <button
            class="btn btn-light-primary btn-sm add-cart-btn"
            (click)="addToCart()"
            [disabled]="isAdding"
            [attr.aria-label]="'Add ' + product.title + ' to cart'"
          >
            @if (cartService.isInCart(product.id)) {
              <i class="bi bi-bag-check-fill"></i>
              In Cart ({{ cartService.getQuantity(product.id) }})
            } @else {
              <i class="bi bi-bag-plus"></i>
              Add
            }
          </button>
        </div>

        <!-- View Details + Stock -->
        <div class="card-bottom-row">
          <a
            [routerLink]="['/products', product.id]"
            class="view-details-link"
            [attr.aria-label]="'View details for ' + product.title"
          >
            View Details <i class="bi bi-arrow-right ms-1"></i>
          </a>

          @if (product.stock <= 5 && product.stock > 0) {
            <span class="low-stock-badge">
              <i class="bi bi-exclamation-circle"></i>
              {{ product.stock }} left
            </span>
          }
          @if (product.stock === 0) {
            <span class="out-of-stock-badge">
              <i class="bi bi-x-circle"></i> Out of stock
            </span>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background: white;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-card);
      border: 1px solid var(--color-border-light);
      transition: all 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .product-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-card-hover);
    }

    .product-card.adding {
      animation: pulse 0.5s ease;
    }

    /* Image */
    .product-image-wrap {
      position: relative;
      overflow: hidden;
      height: 220px;
      background: var(--bg-secondary);
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .product-card:hover .product-image {
      transform: scale(1.06);
    }

    /* Category badge */
    .product-category-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(255,255,255,0.95);
      color: var(--color-primary);
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-full);
      letter-spacing: 0.03em;
      box-shadow: var(--shadow-sm);
    }

    /* Favorite Button */
    .fav-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: rgba(255,255,255,0.95);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      color: var(--color-text-muted);
      transition: all 0.25s ease;
      box-shadow: var(--shadow-sm);
    }

    .fav-btn:hover {
      transform: scale(1.15);
      color: var(--color-accent);
    }

    .fav-btn.favorited {
      color: var(--color-accent);
      background: #fff0f0;
    }

    /* Overlay */
    .product-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%);
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 1rem;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
    }

    .product-card:hover .product-overlay {
      opacity: 1;
      transform: translateY(0);
    }

    .quick-add-btn {
      width: 100%;
      border-radius: var(--radius-md);
    }

    /* Product Info */
    .product-info {
      padding: 1rem 1.1rem 1.1rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      flex: 1;
    }

    .rating-row {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .rating-value {
      font-size: 0.75rem;
      color: var(--color-text-muted);
    }

    .product-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--color-text);
      line-height: 1.3;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      transition: color 0.2s;
    }

    .product-title:hover {
      color: var(--color-primary);
      text-decoration: underline;
    }

    .product-desc {
      font-size: 0.8rem;
      color: var(--color-text-muted);
      margin: 0;
      line-height: 1.5;
    }

    .product-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
      padding-top: 0.5rem;
    }

    .add-cart-btn {
      font-size: 0.8rem;
      padding: 0.35rem 0.75rem;
    }

    .card-bottom-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.75rem;
      padding-top: 0.75rem;
      border-top: 1px dashed var(--color-border-light);
    }

    .view-details-link {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--color-text-muted);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      transition: color 0.15s;
    }

    .view-details-link:hover { color: var(--color-primary); }

    .low-stock-badge {
      font-size: 0.75rem;
      color: #d97706;
      background: #fef3c7;
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    .out-of-stock-badge {
      font-size: 0.75rem;
      color: #dc2626;
      background: #fee2e2;
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }
  `]
})
export class ProductCardComponent implements OnInit {
  @Input({ required: true }) product!: Product;

  isAdding = false;
  isFavorited = false;

  constructor(
    public cartService: CartService,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isFavorited = this.favoritesService.isFavorite(this.product.id);
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    if (this.product.stock === 0) return;
    this.cartService.addToCart(this.product);
    this.isAdding = true;
    setTimeout(() => (this.isAdding = false), 1500);
  }

  toggleFavorite(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const userId = this.authService.getCurrentUserId()!;
    this.isFavorited = !this.isFavorited;
    this.favoritesService.toggleFavorite(userId, this.product.id).subscribe();
  }

  getStars(rating: number): string[] {
    const stars: string[] = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) stars.push('bi bi-star-fill');
      else if (i === fullStars && hasHalf) stars.push('bi bi-star-half');
      else stars.push('bi bi-star');
    }
    return stars;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/400x300/e8eaff/4a5cff?text=Product';
  }
}
