import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { ProductService } from '../../core/services/product.service';
import { Product, ProductCategory } from '../../core/models/product.model';
import { debounceTime, Subject, switchMap, of, startWith, combineLatest } from 'rxjs';

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating' | 'name';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  template: `
    <div class="products-page" style="padding-top: 70px;">
      <!-- Page Header -->
      <div class="page-header">
        <div class="container">
          <h1 class="page-title">
            @if (activeCategory !== 'All') {
              {{ activeCategory }}
            } @else {
              All Products
            }
          </h1>
          <p class="page-subtitle">
            {{ filteredProducts.length }} product{{ filteredProducts.length !== 1 ? 's' : '' }} found
          </p>
        </div>
      </div>

      <div class="container py-4">
        <div class="row g-4">
          <!-- Sidebar Filters -->
          <div class="col-lg-3">
            <div class="filter-sidebar">
              <!-- Search -->
              <div class="filter-block">
                <h6 class="filter-label">Search</h6>
                <div class="search-input-wrap">
                  <i class="bi bi-search search-icon"></i>
                  <input
                    type="text"
                    class="form-control search-input"
                    placeholder="Search products..."
                    [(ngModel)]="searchQuery"
                    (ngModelChange)="onSearchChange()"
                    aria-label="Search products"
                    id="product-search"
                  />
                  @if (searchQuery) {
                    <button class="search-clear" (click)="clearSearch()" aria-label="Clear search">
                      <i class="bi bi-x"></i>
                    </button>
                  }
                </div>
              </div>

              <!-- Category Filter -->
              <div class="filter-block">
                <h6 class="filter-label">Category</h6>
                <div class="category-filter-list">
                  @for (cat of allCategories; track cat) {
                    <button
                      class="category-filter-btn"
                      [class.active]="activeCategory === cat"
                      (click)="setCategory(cat)"
                      [attr.aria-pressed]="activeCategory === cat"
                    >
                      <span>{{ cat }}</span>
                      <span class="cat-count">{{ getCategoryCount(cat) }}</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Price Range Filter -->
              <div class="filter-block">
                <h6 class="filter-label">Max Price: <strong>\${{ maxPrice }}</strong></h6>
                <input
                  type="range"
                  class="price-slider"
                  [min]="0"
                  [max]="1500"
                  step="50"
                  [(ngModel)]="maxPrice"
                  (ngModelChange)="applyFilters()"
                  aria-label="Max price filter"
                />
                <div class="price-range-labels">
                  <span>\$0</span>
                  <span>\$1500</span>
                </div>
              </div>

              <!-- Sort -->
              <div class="filter-block">
                <h6 class="filter-label">Sort By</h6>
                <select class="form-select" [(ngModel)]="sortBy" (ngModelChange)="applyFilters()" aria-label="Sort products">
                  <option value="default">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name A–Z</option>
                </select>
              </div>

              <!-- Clear Filters -->
              @if (hasActiveFilters) {
                <button class="btn btn-outline-primary w-100" (click)="clearFilters()">
                  <i class="bi bi-x-circle"></i> Clear All Filters
                </button>
              }
            </div>
          </div>

          <!-- Products Grid -->
          <div class="col-lg-9">
            <!-- Top Bar (mobile filters toggle + sort) -->
            <div class="products-topbar d-lg-none mb-3">
              <button class="btn btn-outline-primary btn-sm" (click)="toggleMobileFilters()">
                <i class="bi bi-funnel"></i> Filters
              </button>
              <select class="form-select form-select-sm w-auto" [(ngModel)]="sortBy" (ngModelChange)="applyFilters()">
                <option value="default">Featured</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            @if (isLoading) {
              <!-- Skeleton Loading -->
              <div class="row g-4">
                @for (i of [1,2,3,4,5,6]; track i) {
                  <div class="col-xl-4 col-md-6">
                    <div class="skeleton-card">
                      <div class="skeleton" style="height: 220px;"></div>
                      <div style="padding: 1rem;">
                        <div class="skeleton" style="height: 12px; width: 50%; margin-bottom: 8px;"></div>
                        <div class="skeleton" style="height: 18px; width: 90%; margin-bottom: 6px;"></div>
                        <div class="skeleton" style="height: 14px; width: 70%; margin-bottom: 12px;"></div>
                        <div class="skeleton" style="height: 32px;"></div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            } @else if (filteredProducts.length === 0) {
              <!-- Empty State -->
              <div class="empty-state">
                <i class="bi bi-search" style="font-size: 4rem; color: var(--color-border);"></i>
                <h4 class="mt-3">No products found</h4>
                <p class="text-muted">Try adjusting your filters or search query</p>
                <button class="btn btn-primary" (click)="clearFilters()">
                  Reset Filters
                </button>
              </div>
            } @else {
              <div class="row g-4">
                @for (product of filteredProducts; track product.id) {
                  <div class="col-xl-4 col-md-6 animate-fadeInUp">
                    <app-product-card [product]="product" />
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .products-page {
      min-height: 100vh;
      background: var(--bg-primary);
    }

    .page-header {
      background: linear-gradient(135deg, var(--color-primary) 0%, #7c3aed 100%);
      padding: 2.5rem 0;
      color: white;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 800;
      margin: 0;
    }

    .page-subtitle {
      margin: 0.25rem 0 0;
      opacity: 0.85;
      font-size: 1rem;
    }

    /* === Sidebar === */
    .filter-sidebar {
      background: white;
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      box-shadow: var(--shadow-card);
      border: 1px solid var(--color-border-light);
      position: sticky;
      top: 90px;
    }

    .filter-block {
      padding-bottom: 1.25rem;
      margin-bottom: 1.25rem;
      border-bottom: 1px solid var(--color-border-light);
    }

    .filter-block:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    .filter-label {
      font-weight: 700;
      color: var(--color-text);
      margin-bottom: 0.75rem;
      font-size: 0.875rem;
    }

    /* Search Input */
    .search-input-wrap {
      position: relative;
    }

    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-muted);
      font-size: 0.875rem;
      z-index: 1;
    }

    .search-input {
      padding-left: 2.25rem;
      padding-right: 2.25rem;
    }

    .search-clear {
      position: absolute;
      right: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--color-text-muted);
      cursor: pointer;
      font-size: 1rem;
      padding: 0;
      display: flex;
    }

    /* Category Filter Buttons */
    .category-filter-list {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .category-filter-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0.75rem;
      border-radius: var(--radius-md);
      background: none;
      border: 2px solid transparent;
      color: var(--color-text-muted);
      font-weight: 500;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
      font-family: var(--font-family);
    }

    .category-filter-btn:hover {
      background: var(--color-primary-light);
      color: var(--color-primary);
    }

    .category-filter-btn.active {
      background: var(--color-primary-light);
      color: var(--color-primary);
      border-color: var(--color-primary);
      font-weight: 700;
    }

    .cat-count {
      background: var(--color-border-light);
      color: var(--color-text-muted);
      font-size: 0.7rem;
      padding: 0.1rem 0.4rem;
      border-radius: var(--radius-full);
    }

    .category-filter-btn.active .cat-count {
      background: var(--color-primary);
      color: white;
    }

    /* Price Slider */
    .price-slider {
      width: 100%;
      accent-color: var(--color-primary);
      cursor: pointer;
    }

    .price-range-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--color-text-muted);
      margin-top: 0.35rem;
    }

    .products-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .skeleton-card {
      background: white;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-card);
    }

    @media (max-width: 991px) {
      .filter-sidebar {
        position: static;
      }
    }
  `]
})
export class ProductsComponent implements OnInit {
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = true;
  searchQuery = '';
  activeCategory = 'All';
  maxPrice = 1500;
  sortBy: SortOption = 'default';
  showMobileFilters = false;

  allCategories = ['All', 'Electronics', 'Clothing', 'Books', 'Home & Kitchen'];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Load all products
    this.productService.getProducts().subscribe({
      next: products => {
        this.allProducts = products;
        this.isLoading = false;
        // Check for URL category param
        this.route.queryParams.subscribe(params => {
          if (params['category']) {
            this.activeCategory = params['category'];
          }
          this.applyFilters();
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  get hasActiveFilters(): boolean {
    return this.searchQuery !== '' || this.activeCategory !== 'All' || this.maxPrice < 1500;
  }

  setCategory(cat: string): void {
    this.activeCategory = cat;
    this.applyFilters();
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.activeCategory = 'All';
    this.maxPrice = 1500;
    this.sortBy = 'default';
    this.applyFilters();
  }

  toggleMobileFilters(): void {
    this.showMobileFilters = !this.showMobileFilters;
  }

  getCategoryCount(cat: string): number {
    if (cat === 'All') return this.allProducts.length;
    return this.allProducts.filter(p => p.category === cat).length;
  }

  applyFilters(): void {
    let result = [...this.allProducts];

    // Category filter
    if (this.activeCategory !== 'All') {
      result = result.filter(p => p.category === this.activeCategory);
    }

    // Search filter
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Price filter
    result = result.filter(p => p.price <= this.maxPrice);

    // Sort
    switch (this.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    this.filteredProducts = result;
  }
}
