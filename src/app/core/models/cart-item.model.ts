import { Product } from './product.model';

// Item in the shopping cart
export interface CartItem {
  product: Product;
  quantity: number;
}

// Cart summary
export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
