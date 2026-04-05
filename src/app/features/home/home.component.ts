import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ProductService } from '../../core/services/product.service';
import { Product, ProductCategory } from '../../core/models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-bg"></div>
      <div class="container">
        <div class="row align-items-center min-vh-hero">
          <div class="col-lg-6 animate-fadeInUp">
            <div class="hero-badge">
              <i class="bi bi-lightning-charge-fill"></i>
              New Arrivals Just Dropped
            </div>
            <h1 class="hero-title">
              Discover Products <br/>
              <span class="gradient-text">You'll Love</span>
            </h1>
            <p class="hero-subtitle">
              Explore our curated collection of premium electronics, fashion, books, and home essentials.
              Quality guaranteed, delivered to your door.
            </p>
            <div class="hero-actions">
              <a routerLink="/products" class="btn btn-primary btn-lg" aria-label="Shop all products">
                <i class="bi bi-bag-heart"></i> Shop Now
              </a>
              <a routerLink="/products" class="btn btn-outline-primary btn-lg" aria-label="View all categories">
                View Categories
              </a>
            </div>

            <!-- Stats -->
            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">28+</span>
                <span class="stat-label">Products</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number">4</span>
                <span class="stat-label">Categories</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number">4.7★</span>
                <span class="stat-label">Avg Rating</span>
              </div>
            </div>
          </div>

          <div class="col-lg-6 d-none d-lg-flex justify-content-end">
            <div class="hero-visual">
              <div class="hero-card hero-card-1">
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80" alt="Sony Headphones" loading="lazy"/>
              </div>
              <div class="hero-card hero-card-2">
                <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=80" alt="KitchenAid Mixer" loading="lazy"/>
              </div>
              <div class="hero-card hero-card-3">
                <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80" alt="Books" loading="lazy"/>
              </div>
              <div class="hero-float-badge">
                <i class="bi bi-truck"></i>
                Free Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Badges -->
    <section class="trust-section">
      <div class="container">
        <div class="trust-grid">
          <div class="trust-item">
            <div class="trust-icon"><i class="bi bi-truck"></i></div>
            <div>
              <h6>Free Shipping</h6>
              <p>On orders over $50</p>
            </div>
          </div>
          <div class="trust-item">
            <div class="trust-icon"><i class="bi bi-shield-check"></i></div>
            <div>
              <h6>Secure Payment</h6>
              <p>100% protected</p>
            </div>
          </div>
          <div class="trust-item">
            <div class="trust-icon"><i class="bi bi-arrow-counterclockwise"></i></div>
            <div>
              <h6>Easy Returns</h6>
              <p>30-day return policy</p>
            </div>
          </div>
          <div class="trust-item">
            <div class="trust-icon"><i class="bi bi-headset"></i></div>
            <div>
              <h6>24/7 Support</h6>
              <p>Always here for you</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="section categories-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Shop by <span class="gradient-text">Category</span></h2>
          <p class="section-subtitle">Browse our wide selection of hand-picked products</p>
        </div>

        <div class="categories-grid">
          @for (cat of categories; track cat.name) {
            <a
              [routerLink]="['/products']"
              [queryParams]="{category: cat.name}"
              class="category-card"
              [style.--cat-color]="cat.color"
              [attr.aria-label]="'Shop ' + cat.name"
            >
              <div class="category-icon">{{ cat.icon }}</div>
              <h3 class="category-name">{{ cat.name }}</h3>
              <p class="category-count">{{ cat.count }} products</p>
              <div class="category-arrow">
                <i class="bi bi-arrow-right"></i>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- Featured Products -->
    <section class="section featured-section">
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Featured <span class="gradient-text">Products</span></h2>
            <p class="section-subtitle">Our top-rated picks, curated just for you</p>
          </div>
          <a routerLink="/products" class="btn btn-outline-primary">View All <i class="bi bi-arrow-right"></i></a>
        </div>

        @if (isLoading) {
          <div class="row g-4">
            @for (i of [1,2,3,4]; track i) {
              <div class="col-xl-3 col-lg-4 col-md-6">
                <div class="skeleton-card">
                  <div class="skeleton" style="height: 220px;"></div>
                  <div style="padding: 1rem;">
                    <div class="skeleton" style="height: 14px; width: 60%; margin-bottom: 8px;"></div>
                    <div class="skeleton" style="height: 18px; width: 90%; margin-bottom: 8px;"></div>
                    <div class="skeleton" style="height: 14px; width: 70%;"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="row g-4">
            @for (product of featuredProducts; track product.id) {
              <div class="col-xl-3 col-lg-4 col-md-6 animate-fadeInUp">
                <app-product-card [product]="product" />
              </div>
            }
          </div>
        }
      </div>
    </section>

    <!-- Promo Banner -->
    <section class="promo-section">
      <div class="container">
        <div class="promo-card">
          <div class="promo-content">
            <span class="promo-badge">Limited Time</span>
            <h2>Get 20% Off Your First Order</h2>
            <p>Register today and use code <strong>WAVE20</strong> at checkout.</p>
            <a routerLink="/auth/register" class="btn btn-primary btn-lg mt-2">
              <i class="bi bi-gift"></i> Claim Your Discount
            </a>
          </div>
          <div class="promo-decoration">
            <i class="bi bi-stars"></i>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Navbar offset */
    section:first-of-type {
      padding-top: 70px;
    }

    /* === Hero === */
    .hero-section {
      position: relative;
      padding: 5rem 0 4rem;
      overflow: hidden;
      background: var(--bg-primary);
    }

    .hero-bg {
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 80% 50%, rgba(74,92,255,0.07) 0%, transparent 70%);
      pointer-events: none;
    }

    .min-vh-hero {
      min-height: calc(90vh - 70px);
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: var(--color-primary-light);
      color: var(--color-primary);
      padding: 0.4rem 1rem;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }

    .hero-title {
      font-size: clamp(2.2rem, 5vw, 3.5rem);
      font-weight: 800;
      line-height: 1.1;
      color: var(--color-text);
      margin-bottom: 1.25rem;
    }

    .gradient-text {
      background: linear-gradient(135deg, var(--color-primary), #7c3aed, var(--color-accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero-subtitle {
      font-size: 1.1rem;
      color: var(--color-text-muted);
      line-height: 1.7;
      max-width: 480px;
      margin-bottom: 2rem;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
    }

    .hero-stats {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--color-primary);
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      font-weight: 500;
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: var(--color-border);
    }

    /* Hero Visual */
    .hero-visual {
      position: relative;
      width: 480px;
      height: 420px;
    }

    .hero-card {
      position: absolute;
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .hero-card img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-card-1 {
      width: 220px;
      height: 240px;
      top: 0;
      right: 80px;
      animation: float 6s ease-in-out infinite;
    }

    .hero-card-2 {
      width: 200px;
      height: 180px;
      bottom: 0;
      right: 0;
      animation: float 6s ease-in-out infinite 2s;
    }

    .hero-card-3 {
      width: 180px;
      height: 200px;
      bottom: 30px;
      left: 0;
      animation: float 6s ease-in-out infinite 4s;
    }

    .hero-float-badge {
      position: absolute;
      top: 140px;
      left: 20px;
      background: white;
      border-radius: var(--radius-md);
      padding: 0.6rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--color-text);
      box-shadow: var(--shadow-lg);
      animation: float 5s ease-in-out infinite 1s;
    }

    .hero-float-badge i {
      color: var(--color-primary);
    }

    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-12px); }
    }

    /* === Trust Section === */
    .trust-section {
      background: white;
      border-top: 1px solid var(--color-border);
      border-bottom: 1px solid var(--color-border);
      padding: 1.5rem 0;
    }

    .trust-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .trust-item {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.75rem;
    }

    .trust-icon {
      width: 44px;
      height: 44px;
      background: var(--color-primary-light);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      color: var(--color-primary);
      flex-shrink: 0;
    }

    .trust-item h6 {
      font-weight: 700;
      font-size: 0.875rem;
      color: var(--color-text);
      margin: 0;
    }

    .trust-item p {
      font-size: 0.75rem;
      color: var(--color-text-muted);
      margin: 0;
    }

    /* === Section Header === */
    .section-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 2.5rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    /* === Categories === */
    .categories-section {
      background: var(--bg-primary);
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.25rem;
    }

    .category-card {
      background: white;
      border-radius: var(--radius-xl);
      padding: 2rem 1.5rem;
      text-align: center;
      text-decoration: none;
      border: 2px solid var(--color-border-light);
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      display: block;
    }

    .category-card::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--cat-color, var(--color-primary));
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    .category-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-lg);
      border-color: var(--cat-color, var(--color-primary));
    }

    .category-card:hover::before {
      transform: scaleX(1);
    }

    .category-icon {
      font-size: 2.5rem;
      margin-bottom: 0.75rem;
    }

    .category-name {
      font-size: 1rem;
      font-weight: 700;
      color: var(--color-text);
      margin-bottom: 0.25rem;
    }

    .category-count {
      font-size: 0.8rem;
      color: var(--color-text-muted);
      margin: 0;
    }

    .category-arrow {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: 0.9rem;
      color: var(--color-text-light);
      transition: all 0.2s;
    }

    .category-card:hover .category-arrow {
      color: var(--cat-color, var(--color-primary));
      transform: translate(3px, -3px);
    }

    /* === Featured === */
    .featured-section {
      background: var(--bg-secondary);
    }

    .skeleton-card {
      background: white;
      border-radius: var(--radius-lg);
      overflow: hidden;
    }

    /* === Promo Banner === */
    .promo-section {
      padding: 3rem 0 4rem;
      background: var(--bg-primary);
    }

    .promo-card {
      background: linear-gradient(135deg, var(--color-primary) 0%, #7c3aed 100%);
      border-radius: var(--radius-xl);
      padding: 3rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      overflow: hidden;
      position: relative;
    }

    .promo-content {
      color: white;
      position: relative;
      z-index: 1;
    }

    .promo-content h2 {
      font-size: clamp(1.5rem, 3vw, 2rem);
      font-weight: 800;
      margin: 0.5rem 0;
    }

    .promo-content p {
      opacity: 0.9;
      margin-bottom: 0;
    }

    .promo-badge {
      background: rgba(255,255,255,0.2);
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.8rem;
      font-weight: 600;
    }

    .promo-content .btn-primary {
      background: white;
      color: var(--color-primary);
      box-shadow: none;
    }

    .promo-content .btn-primary:hover {
      background: rgba(255,255,255,0.9);
    }

    .promo-decoration {
      font-size: 8rem;
      color: rgba(255,255,255,0.1);
      line-height: 1;
    }

    @media (max-width: 992px) {
      .trust-grid { grid-template-columns: repeat(2, 1fr); }
      .categories-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 576px) {
      .trust-grid { grid-template-columns: 1fr 1fr; }
      .hero-actions { flex-direction: column; }
      .promo-card { flex-direction: column; text-align: center; }
      .promo-decoration { display: none; }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  isLoading = true;

  categories = [
    { name: 'Electronics', icon: '💻', count: 7, color: '#4a5cff' },
    { name: 'Clothing', icon: '👗', count: 7, color: '#ec4899' },
    { name: 'Books', icon: '📚', count: 7, color: '#f59e0b' },
    { name: 'Home & Kitchen', icon: '🏠', count: 7, color: '#22c55e' }
  ] as const;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getFeaturedProducts().subscribe({
      next: products => {
        this.featuredProducts = products;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
