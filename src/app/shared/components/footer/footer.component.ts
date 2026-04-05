import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="row gy-4">
          <!-- Brand Column -->
          <div class="col-lg-4 col-md-6">
            <div class="footer-brand">
              <div class="brand-logo">
                <i class="bi bi-bag-heart-fill"></i>
              </div>
              <span class="brand-text">ShopWave</span>
            </div>
            <p class="footer-desc">
              Your premium destination for electronics, fashion, books, and home essentials. Quality you can trust, delivered to your door.
            </p>
            <div class="social-links">
              <a href="#" class="social-btn" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>
              <a href="#" class="social-btn" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
              <a href="#" class="social-btn" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
              <a href="#" class="social-btn" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
            </div>
          </div>

          <!-- Shop Links -->
          <div class="col-lg-2 col-md-6 col-6">
            <h6 class="footer-heading">Shop</h6>
            <ul class="footer-links">
              <li><a routerLink="/products">All Products</a></li>
              <li><a routerLink="/products">Electronics</a></li>
              <li><a routerLink="/products">Clothing</a></li>
              <li><a routerLink="/products">Books</a></li>
              <li><a routerLink="/products">Home & Kitchen</a></li>
            </ul>
          </div>

          <!-- Account Links -->
          <div class="col-lg-2 col-md-6 col-6">
            <h6 class="footer-heading">Account</h6>
            <ul class="footer-links">
              <li><a routerLink="/auth/login">Sign In</a></li>
              <li><a routerLink="/auth/register">Register</a></li>
              <li><a routerLink="/profile">My Profile</a></li>
              <li><a routerLink="/cart">Cart</a></li>
              <li><a routerLink="/favorites">Favorites</a></li>
            </ul>
          </div>

          <!-- Support Links -->
          <div class="col-lg-2 col-md-6 col-6">
            <h6 class="footer-heading">Support</h6>
            <ul class="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Track Order</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div class="col-lg-2 col-md-6 col-6">
            <h6 class="footer-heading">Stay Updated</h6>
            <p class="footer-desc" style="font-size: 0.85rem;">Get deals and new arrivals directly in your inbox.</p>
            <div class="newsletter-form">
              <input type="email" placeholder="your@email.com" class="newsletter-input" aria-label="Email for newsletter" />
              <button class="btn btn-primary btn-sm w-100 mt-2">Subscribe</button>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} ShopWave. All rights reserved.</p>
          <div class="payment-icons">
            <i class="bi bi-credit-card" title="Credit Card"></i>
            <i class="bi bi-paypal" title="PayPal"></i>
            <i class="bi bi-bank" title="Bank Transfer"></i>
            <i class="bi bi-shield-check" title="Secure Payment"></i>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background: var(--color-dark);
      color: #9ca3af;
      padding: 3.5rem 0 0;
      margin-top: 4rem;
    }

    .footer-brand {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      margin-bottom: 1rem;
    }

    .brand-logo {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--color-primary), #7c3aed);
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      color: white;
    }

    .brand-text {
      font-size: 1.2rem;
      font-weight: 800;
      color: white;
    }

    .footer-desc {
      font-size: 0.875rem;
      line-height: 1.7;
      margin-bottom: 1.25rem;
    }

    .social-links {
      display: flex;
      gap: 0.5rem;
    }

    .social-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      background: rgba(255,255,255,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .social-btn:hover {
      background: var(--color-primary);
      color: white;
      transform: translateY(-2px);
    }

    .footer-heading {
      color: white;
      font-weight: 700;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin-bottom: 1rem;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .footer-links a {
      color: #9ca3af;
      font-size: 0.875rem;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .footer-links a:hover {
      color: var(--color-primary);
    }

    .newsletter-input {
      width: 100%;
      padding: 0.55rem 0.85rem;
      border-radius: var(--radius-md);
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.06);
      color: white;
      font-size: 0.85rem;
      font-family: var(--font-family);
      transition: border-color 0.2s;
    }

    .newsletter-input::placeholder {
      color: #6b7280;
    }

    .newsletter-input:focus {
      outline: none;
      border-color: var(--color-primary);
    }

    .footer-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem 0;
      margin-top: 3rem;
      border-top: 1px solid rgba(255,255,255,0.08);
      font-size: 0.8rem;
    }

    .payment-icons {
      display: flex;
      gap: 0.75rem;
      font-size: 1.2rem;
    }

    .payment-icons i {
      color: #6b7280;
      transition: color 0.2s;
    }

    .payment-icons i:hover {
      color: white;
    }

    @media (max-width: 768px) {
      .footer-bottom {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
