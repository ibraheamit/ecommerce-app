import { Injectable, signal, computed, effect } from '@angular/core';
import { CartItem, CartSummary } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { ToastService } from './toast.service';

const CART_KEY = 'shopwave_cart';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Reactive state using Angular signals
  private _items = signal<CartItem[]>(this.loadCart());

  // Computed values
  readonly items = this._items.asReadonly();

  readonly totalItems = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly totalPrice = computed(() =>
    this._items().reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  );

  readonly cartSummary = computed<CartSummary>(() => ({
    items: this._items(),
    totalItems: this.totalItems(),
    totalPrice: this.totalPrice()
  }));

  constructor(private toastService: ToastService) {
    // Auto-persist cart to localStorage whenever it changes
    effect(() => {
      this.saveCart(this._items());
    });
  }

  /**
   * Add product to cart (or increment quantity if already in cart)
   */
  addToCart(product: Product): void {
    this._items.update(items => {
      const existing = items.find(i => i.product.id === product.id);
      if (existing) {
        return items.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...items, { product, quantity: 1 }];
    });
    this.toastService.success(`Added ${product.title} to cart`);
  }

  /**
   * Remove a product from cart entirely
   */
  removeFromCart(productId: string): void {
    const item = this._items().find(i => i.product.id === productId);
    this._items.update(items => items.filter(i => i.product.id !== productId));
    if (item) {
      this.toastService.info(`Removed ${item.product.title} from cart`);
    }
  }

  /**
   * Set quantity for a product (min 1)
   */
  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 1) {
      this.removeFromCart(productId);
      return;
    }
    this._items.update(items =>
      items.map(i =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    );
  }

  /**
   * Increment quantity by 1
   */
  incrementQuantity(productId: string): void {
    this._items.update(items =>
      items.map(i =>
        i.product.id === productId ? { ...i, quantity: i.quantity + 1 } : i
      )
    );
  }

  /**
   * Decrement quantity by 1 (remove if goes to 0)
   */
  decrementQuantity(productId: string): void {
    const item = this._items().find(i => i.product.id === productId);
    if (item && item.quantity <= 1) {
      this.removeFromCart(productId);
    } else {
      this._items.update(items =>
        items.map(i =>
          i.product.id === productId ? { ...i, quantity: i.quantity - 1 } : i
        )
      );
    }
  }

  /**
   * Check if product is in cart
   */
  isInCart(productId: string): boolean {
    return this._items().some(i => i.product.id === productId);
  }

  /**
   * Get quantity of a specific product in cart
   */
  getQuantity(productId: string): number {
    return this._items().find(i => i.product.id === productId)?.quantity ?? 0;
  }

  /**
   * Clear all items from cart
   */
  clearCart(): void {
    this._items.set([]);
    this.toastService.warning('Your cart has been cleared');
  }

  // === LocalStorage Persistence ===
  private saveCart(items: CartItem[]): void {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  private loadCart(): CartItem[] {
    const stored = localStorage.getItem(CART_KEY);
    if (!stored) return [];
    try {
      return JSON.parse(stored) as CartItem[];
    } catch {
      return [];
    }
  }
}
