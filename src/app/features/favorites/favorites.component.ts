import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { FavoritesService } from '../../core/services/favorites.service';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/product.model';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <div class="favorites-page" style="padding-top: 70px;">
      <div class="page-header">
        <div class="container">
          <h1 class="page-title"><i class="bi bi-heart-fill me-2"></i>My Favorites</h1>
          <p class="page-subtitle">{{ favoriteProducts.length }} saved item{{ favoriteProducts.length !== 1 ? 's' : '' }}</p>
        </div>
      </div>

      <div class="container py-4">
        @if (isLoading) {
          <div class="row g-4">
            @for (i of [1,2,3,4]; track i) {
              <div class="col-xl-3 col-lg-4 col-md-6">
                <div class="skeleton-card">
                  <div class="skeleton" style="height: 220px;"></div>
                  <div style="padding: 1rem;">
                    <div class="skeleton" style="height: 14px; width: 60%; margin-bottom: 8px;"></div>
                    <div class="skeleton" style="height: 18px; width: 90%;"></div>
                  </div>
                </div>
              </div>
            }
          </div>
        } @else if (favoriteProducts.length === 0) {
          <div class="empty-state py-5">
            <div class="empty-favorites-icon">❤️</div>
            <h4 class="mt-3">No favorites yet</h4>
            <p class="text-muted">Start adding products you love by clicking the heart icon</p>
            <a routerLink="/products" class="btn btn-primary btn-lg mt-2">
              <i class="bi bi-bag-heart"></i> Explore Products
            </a>
          </div>
        } @else {
          <div class="row g-4">
            @for (product of favoriteProducts; track product.id) {
              <div class="col-xl-3 col-lg-4 col-md-6 animate-fadeInUp">
                <app-product-card [product]="product" />
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .favorites-page { min-height: 100vh; background: var(--bg-primary); }

    .page-header {
      background: linear-gradient(135deg, var(--color-accent) 0%, #7c3aed 100%);
      padding: 2.5rem 0;
      color: white;
    }
    .page-title { font-size: 2rem; font-weight: 800; margin: 0; }
    .page-subtitle { margin: 0.25rem 0 0; opacity: 0.85; }

    .empty-favorites-icon {
      font-size: 5rem;
      animation: pulse 2s ease-in-out infinite;
    }

    .skeleton-card {
      background: white;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-card);
    }
  `]
})
export class FavoritesComponent implements OnInit {
  favoriteProducts: Product[] = [];
  isLoading = true;

  constructor(
    private favoritesService: FavoritesService,
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    this.favoritesService.getFavoritesByUser(userId).subscribe({
      next: favs => {
        if (favs.length === 0) {
          this.isLoading = false;
          return;
        }

        // Fetch each favorited product
        const productRequests = favs.map(fav =>
          this.productService.getProductById(fav.productId).pipe(
            catchError(() => of(null))
          )
        );

        forkJoin(productRequests).subscribe({
          next: products => {
            this.favoriteProducts = products.filter(p => p !== null) as Product[];
            this.isLoading = false;
          },
          error: () => (this.isLoading = false)
        });
      },
      error: () => (this.isLoading = false)
    });
  }
}
