import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { FavoritesService } from '../../../core/services/favorites.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detail-page" style="padding-top: 70px;">
      @if (isLoading()) {
        <!-- Skeleton -->
        <div class="container py-5">
          <div class="row g-5">
            <div class="col-lg-5">
              <div class="skeleton" style="height: 460px; border-radius: var(--radius-xl);"></div>
            </div>
            <div class="col-lg-7">
              <div class="skeleton" style="height: 20px; width: 30%; margin-bottom: 1rem;"></div>
              <div class="skeleton" style="height: 36px; width: 85%; margin-bottom: 0.75rem;"></div>
              <div class="skeleton" style="height: 18px; width: 50%; margin-bottom: 1.5rem;"></div>
              <div class="skeleton" style="height: 100px; margin-bottom: 1.5rem;"></div>
              <div class="skeleton" style="height: 48px; width: 60%;"></div>
            </div>
          </div>
        </div>
      } @else if (product()) {
        <!-- Breadcrumb -->
        <div class="breadcrumb-bar">
          <div class="container">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb-list">
                <li><a routerLink="/">Home</a></li>
                <li><span class="sep">›</span></li>
                <li><a routerLink="/products">Products</a></li>
                <li><span class="sep">›</span></li>
                <li><a [routerLink]="'/products'" [queryParams]="{category: product()!.category}">{{ product()!.category }}</a></li>
                <li><span class="sep">›</span></li>
                <li class="current" aria-current="page">{{ product()!.title | slice:0:30 }}…</li>
              </ol>
            </nav>
          </div>
        </div>

        <!-- Product Detail -->
        <div class="container py-5">
          <div class="row g-5 align-items-start">
            <!-- Image Panel -->
            <div class="col-lg-5">
              <div class="product-image-panel">
                <!-- Badges -->
                <div class="image-badges">
                  @if (product()!.featured) {
                    <span class="badge-custom badge-primary">⭐ Featured</span>
                  }
                  @if (product()!.stock === 0) {
                    <span class="badge-custom badge-danger">Out of Stock</span>
                  } @else if (product()!.stock <= 5) {
                    <span class="badge-custom badge-warning">Only {{ product()!.stock }} left</span>
                  }
                </div>

                <!-- Favorite button -->
                <button
                  class="fav-btn-detail"
                  [class.favorited]="isFavorited()"
                  (click)="toggleFavorite()"
                  [attr.aria-label]="isFavorited() ? 'Remove from favorites' : 'Add to favorites'"
                  [attr.aria-pressed]="isFavorited()"
                >
                  <i [class]="isFavorited() ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                </button>

                <img
                  [src]="product()!.image"
                  [alt]="product()!.title"
                  class="product-main-image"
                  (error)="onImageError($event)"
                />
              </div>
            </div>

            <!-- Info Panel -->
            <div class="col-lg-7">
              <div class="product-info-panel">
                <!-- Category -->
                <a class="product-category-link" [routerLink]="'/products'" [queryParams]="{category: product()!.category}">
                  <i class="bi bi-tag"></i> {{ product()!.category }}
                </a>

                <!-- Title -->
                <h1 class="product-title-detail">{{ product()!.title }}</h1>

                <!-- Rating Row -->
                <div class="rating-row-detail">
                  <div class="stars-detail" [attr.aria-label]="'Rating ' + product()!.rating + ' out of 5'">
                    @for (star of getStars(product()!.rating); track $index) {
                      <i [class]="star"></i>
                    }
                  </div>
                  <span class="rating-num">{{ product()!.rating }}</span>
                  <span class="rating-text">/ 5.0</span>
                </div>

                <!-- Price -->
                <div class="price-section">
                  <span class="price-detail">\${{ product()!.price | number:'1.2-2' }}</span>
                  @if (product()!.price > 50) {
                    <span class="free-shipping-badge">
                      <i class="bi bi-truck"></i> Free Shipping
                    </span>
                  }
                </div>

                <!-- Description -->
                <div class="description-section">
                  <h6 class="section-label">Description</h6>
                  <p class="description-text">{{ product()!.description }}</p>
                </div>

                <!-- Stock Status -->
                <div class="stock-section">
                  @if (product()!.stock === 0) {
                    <div class="stock-indicator out">
                      <i class="bi bi-x-circle-fill"></i>
                      <span>Out of Stock</span>
                    </div>
                  } @else if (product()!.stock <= 5) {
                    <div class="stock-indicator low">
                      <i class="bi bi-exclamation-circle-fill"></i>
                      <span>Only {{ product()!.stock }} units left — order soon!</span>
                    </div>
                  } @else {
                    <div class="stock-indicator in">
                      <i class="bi bi-check-circle-fill"></i>
                      <span>In Stock ({{ product()!.stock }} available)</span>
                    </div>
                  }
                </div>

                <!-- Quantity + Cart -->
                <div class="cart-section">
                  @if (cartService.isInCart(product()!.id)) {
                    <!-- Already in cart: show qty controls -->
                    <div class="qty-controls">
                      <button
                        class="qty-btn"
                        (click)="cartService.decrementQuantity(product()!.id)"
                        aria-label="Decrease quantity"
                      >
                        <i class="bi bi-dash"></i>
                      </button>
                      <span class="qty-value">{{ cartService.getQuantity(product()!.id) }}</span>
                      <button
                        class="qty-btn"
                        (click)="cartService.incrementQuantity(product()!.id)"
                        aria-label="Increase quantity"
                        [disabled]="cartService.getQuantity(product()!.id) >= product()!.stock"
                      >
                        <i class="bi bi-plus"></i>
                      </button>
                    </div>
                    <a routerLink="/cart" class="btn-go-cart">
                      <i class="bi bi-bag-check"></i> Go to Cart
                    </a>
                  } @else {
                    <button
                      class="btn-add-cart"
                      [disabled]="product()!.stock === 0 || isAdding()"
                      (click)="addToCart()"
                      id="add-to-cart-btn"
                    >
                      @if (isAdding()) {
                        <i class="bi bi-check-lg"></i> Added!
                      } @else {
                        <i class="bi bi-bag-plus"></i> Add to Cart
                      }
                    </button>
                  }

                  <button
                    class="btn-buy-now"
                    [disabled]="product()!.stock === 0"
                    (click)="buyNow()"
                    id="buy-now-btn"
                  >
                    <i class="bi bi-lightning-charge"></i> Buy Now
                  </button>
                </div>

                <!-- Trust Badges -->
                <div class="trust-badges">
                  <div class="trust-item">
                    <i class="bi bi-shield-check"></i>
                    <span>Secure Payment</span>
                  </div>
                  <div class="trust-item">
                    <i class="bi bi-arrow-counterclockwise"></i>
                    <span>30-Day Returns</span>
                  </div>
                  <div class="trust-item">
                    <i class="bi bi-headset"></i>
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Related Products -->
          @if (relatedProducts().length > 0) {
            <div class="related-section">
              <h2 class="related-title">More in {{ product()!.category }}</h2>
              <div class="related-grid">
                @for (rel of relatedProducts(); track rel.id) {
                  <div class="related-card" [routerLink]="['/products', rel.id]">
                    <div class="related-img-wrap">
                      <img [src]="rel.image" [alt]="rel.title" (error)="onImageError($event)" />
                    </div>
                    <div class="related-info">
                      <p class="related-name">{{ rel.title | slice:0:45 }}{{ rel.title.length > 45 ? '…' : '' }}</p>
                      <p class="related-price">\${{ rel.price | number:'1.2-2' }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      } @else {
        <!-- Not found -->
        <div class="container py-5 text-center">
          <i class="bi bi-emoji-frown" style="font-size: 4rem; color: var(--color-border);"></i>
          <h3 class="mt-3">Product not found</h3>
          <p class="text-muted">This product may have been removed.</p>
          <a routerLink="/products" class="btn btn-primary mt-2">Browse Products</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .detail-page {
      min-height: 100vh;
      background: var(--bg-primary);
    }

    /* Breadcrumb */
    .breadcrumb-bar {
      background: white;
      border-bottom: 1px solid var(--color-border-light);
      padding: 0.75rem 0;
    }

    .breadcrumb-list {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      list-style: none;
      margin: 0;
      padding: 0;
      font-size: 0.85rem;
      flex-wrap: wrap;
    }

    .breadcrumb-list a {
      color: var(--color-text-muted);
      text-decoration: none;
      transition: color 0.15s;
    }

    .breadcrumb-list a:hover { color: var(--color-primary); }

    .breadcrumb-list .sep { color: var(--color-border); }
    .breadcrumb-list .current { color: var(--color-text); font-weight: 600; }

    /* Image Panel */
    .product-image-panel {
      position: relative;
      background: white;
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-card);
      border: 1px solid var(--color-border-light);
    }

    .image-badges {
      position: absolute;
      top: 1rem;
      left: 1rem;
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      align-items: flex-start;
    }

    .fav-btn-detail {
      position: absolute;
      top: 1rem;
      right: 1rem;
      z-index: 2;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      color: var(--color-text-muted);
      box-shadow: var(--shadow-sm);
      transition: all 0.25s;
    }

    .fav-btn-detail:hover { transform: scale(1.1); color: var(--color-accent); }
    .fav-btn-detail.favorited { color: var(--color-accent); background: #fff0f0; }

    .product-main-image {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      display: block;
      transition: transform 0.4s ease;
    }

    .product-image-panel:hover .product-main-image { transform: scale(1.03); }

    /* Info Panel */
    .product-info-panel {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .product-category-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--color-primary);
      font-size: 0.875rem;
      font-weight: 700;
      text-decoration: none;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .product-category-link:hover { opacity: 0.8; }

    .product-title-detail {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--color-text);
      line-height: 1.25;
      margin: 0;
    }

    /* Rating */
    .rating-row-detail {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .stars-detail { display: flex; gap: 2px; color: #f59e0b; font-size: 1rem; }
    .rating-num { font-weight: 700; font-size: 1rem; color: var(--color-text); }
    .rating-text { font-size: 0.875rem; color: var(--color-text-muted); }

    /* Price */
    .price-section {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .price-detail {
      font-size: 2.25rem;
      font-weight: 900;
      background: linear-gradient(135deg, var(--color-primary), #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .free-shipping-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: #dcfce7;
      color: #166534;
      font-size: 0.8rem;
      font-weight: 700;
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-full);
    }

    /* Description */
    .section-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: var(--color-text-muted);
      margin-bottom: 0.5rem;
    }

    .description-text {
      color: var(--color-text-muted);
      line-height: 1.75;
      font-size: 0.95rem;
      margin: 0;
    }

    /* Stock */
    .stock-section { }

    .stock-indicator {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      padding: 0.5rem 0.85rem;
      border-radius: var(--radius-md);
    }

    .stock-indicator.in { background: #dcfce7; color: #166534; }
    .stock-indicator.low { background: #fef3c7; color: #92400e; }
    .stock-indicator.out { background: #fee2e2; color: #991b1b; }

    /* Cart Section */
    .cart-section {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      flex-wrap: wrap;
    }

    .qty-controls {
      display: flex;
      align-items: center;
      border: 2px solid var(--color-primary);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .qty-btn {
      width: 40px;
      height: 44px;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-primary);
      font-size: 1.1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
    }

    .qty-btn:hover { background: var(--color-primary-light); }
    .qty-btn:disabled { opacity: 0.4; cursor: not-allowed; }

    .qty-value {
      min-width: 44px;
      text-align: center;
      font-weight: 700;
      font-size: 1rem;
      color: var(--color-text);
      padding: 0 0.25rem;
    }

    .btn-add-cart {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.8rem 2rem;
      background: linear-gradient(135deg, var(--color-primary), #7c3aed);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.25s;
      font-family: var(--font-family);
      box-shadow: 0 4px 15px rgba(74, 92, 255, 0.35);
    }

    .btn-add-cart:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(74, 92, 255, 0.45);
    }

    .btn-add-cart:disabled { opacity: 0.6; cursor: not-allowed; }

    .btn-go-cart {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.8rem 1.5rem;
      background: #22c55e;
      color: white;
      border-radius: var(--radius-md);
      font-weight: 700;
      text-decoration: none;
      font-size: 0.95rem;
      transition: all 0.2s;
    }

    .btn-go-cart:hover { background: #16a34a; transform: translateY(-1px); color: white; }

    .btn-buy-now {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.8rem 1.5rem;
      background: #f59e0b;
      color: white;
      border: none;
      border-radius: var(--radius-md);
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s;
      font-family: var(--font-family);
    }

    .btn-buy-now:hover:not(:disabled) { background: #d97706; transform: translateY(-1px); }
    .btn-buy-now:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Trust Badges */
    .trust-badges {
      display: flex;
      gap: 1.25rem;
      padding: 1rem 0;
      border-top: 1px solid var(--color-border-light);
      flex-wrap: wrap;
    }

    .trust-item {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--color-text-muted);
    }

    .trust-item i { color: var(--color-primary); font-size: 1rem; }

    /* Related Products */
    .related-section {
      margin-top: 4rem;
      padding-top: 3rem;
      border-top: 1px solid var(--color-border-light);
    }

    .related-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--color-text);
      margin-bottom: 1.5rem;
    }

    .related-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
      gap: 1rem;
    }

    .related-card {
      background: white;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-card);
      border: 1px solid var(--color-border-light);
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
    }

    .related-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-card-hover); }

    .related-img-wrap {
      height: 140px;
      overflow: hidden;
      background: var(--bg-secondary);
    }

    .related-img-wrap img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s;
    }

    .related-card:hover .related-img-wrap img { transform: scale(1.05); }

    .related-info { padding: 0.75rem; }
    .related-name { font-size: 0.8rem; font-weight: 600; color: var(--color-text); margin: 0 0 0.25rem; line-height: 1.3; }
    .related-price { font-size: 0.875rem; font-weight: 800; color: var(--color-primary); margin: 0; }

    /* Skeleton */
    .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
      border-radius: var(--radius-md);
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @media (max-width: 768px) {
      .product-title-detail { font-size: 1.4rem; }
      .price-detail { font-size: 1.75rem; }
      .btn-add-cart, .btn-buy-now, .btn-go-cart { width: 100%; justify-content: center; }
      .cart-section { flex-direction: column; align-items: stretch; }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  // Using signals for reactive state
  private _product = signal<Product | null>(null);
  private _isLoading = signal<boolean>(true);
  private _isAdding = signal<boolean>(false);
  private _relatedProducts = signal<Product[]>([]);

  readonly product = this._product.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isAdding = this._isAdding.asReadonly();
  readonly relatedProducts = this._relatedProducts.asReadonly();

  readonly isFavorited = computed(() => {
    const p = this._product();
    return p ? this.favoritesService.isFavorite(p.id) : false;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    public cartService: CartService,
    private favoritesService: FavoritesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) {
        this._isLoading.set(false);
        return;
      }
      this.loadProduct(id);
    });
  }

  private loadProduct(id: string): void {
    this._isLoading.set(true);
    this._product.set(null);

    this.productService.getProductById(id).subscribe({
      next: product => {
        this._product.set(product);
        this._isLoading.set(false);
        this.loadRelated(product);
      },
      error: () => {
        this._isLoading.set(false);
      }
    });
  }

  private loadRelated(current: Product): void {
    this.productService.getProductsByCategory(current.category).subscribe({
      next: products => {
        // Exclude current product, limit to 5
        const related = products
          .filter(p => p.id !== current.id)
          .slice(0, 5);
        this._relatedProducts.set(related);
      },
      error: () => this._relatedProducts.set([])
    });
  }

  addToCart(): void {
    const p = this._product();
    if (!p) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (p.stock === 0) return;

    this.cartService.addToCart(p);
    this._isAdding.set(true);
    setTimeout(() => this._isAdding.set(false), 1500);
  }

  buyNow(): void {
    const p = this._product();
    if (!p) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (p.stock === 0) return;

    // Add to cart if not already there, then navigate to checkout
    if (!this.cartService.isInCart(p.id)) {
      this.cartService.addToCart(p);
    }
    this.router.navigate(['/checkout']);
  }

  toggleFavorite(): void {
    const p = this._product();
    if (!p) return;

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const userId = this.authService.getCurrentUserId();
    if (userId === null) return;

    this.favoritesService.toggleFavorite(userId, p.id).subscribe();
  }

  /**
   * Builds an array of Bootstrap Icon class names for a star rating.
   * Uses full, half, and empty star icons based on the numeric rating.
   */
  getStars(rating: number): string[] {
    const stars: string[] = [];
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < full) {
        stars.push('bi bi-star-fill');
      } else if (i === full && hasHalf) {
        stars.push('bi bi-star-half');
      } else {
        stars.push('bi bi-star');
      }
    }
    return stars;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'https://placehold.co/600x600/e8eaff/4a5cff?text=Product';
  }
}
