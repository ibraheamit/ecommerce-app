import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-page" style="padding-top: 70px;">
      <div class="container py-5">
        <div class="not-found-content animate-fadeInUp">
          <div class="not-found-number">404</div>
          <h1 class="not-found-title">Page Not Found</h1>
          <p class="not-found-subtitle">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div class="not-found-actions">
            <a routerLink="/" class="btn btn-primary btn-lg">
              <i class="bi bi-house"></i> Go Home
            </a>
            <a routerLink="/products" class="btn btn-outline-primary btn-lg">
              <i class="bi bi-bag-heart"></i> Browse Products
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-page {
      min-height: 100vh;
      background: var(--bg-primary);
      display: flex;
      align-items: center;
    }

    .not-found-content {
      text-align: center;
      max-width: 500px;
      margin: 0 auto;
    }

    .not-found-number {
      font-size: 8rem;
      font-weight: 900;
      background: linear-gradient(135deg, var(--color-primary), #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      line-height: 1;
      margin-bottom: 0.5rem;
    }

    .not-found-title {
      font-size: 2rem;
      font-weight: 800;
      color: var(--color-text);
      margin-bottom: 0.75rem;
    }

    .not-found-subtitle {
      color: var(--color-text-muted);
      font-size: 1.1rem;
      margin-bottom: 2rem;
      line-height: 1.7;
    }

    .not-found-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
  `]
})
export class NotFoundComponent {}
