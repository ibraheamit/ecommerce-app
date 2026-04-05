// Order status
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

// Product snapshot in an order
export interface OrderProduct {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

// Full order model
export interface Order {
  id?: string;
  userId: string;
  products: OrderProduct[];
  totalPrice: number;
  status: OrderStatus;
  shippingAddress: string;
  createdAt: string;
}

// Checkout form data
export interface CheckoutForm {
  name: string;
  email: string;
  address: string;
  phone: string;
  city: string;
  zipCode: string;
}
