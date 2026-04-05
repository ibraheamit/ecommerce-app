// Product category type
export type ProductCategory = 'Electronics' | 'Clothing' | 'Books' | 'Home & Kitchen';

// Product model matching db.json
export interface Product {
  id: string;
  title: string;
  price: number;
  category: ProductCategory;
  description: string;
  image: string;
  rating: number;
  stock: number;
  featured: boolean;
}

// For creating/updating products (no id needed)
export interface ProductForm {
  title: string;
  price: number;
  category: ProductCategory;
  description: string;
  image: string;
  rating: number;
  stock: number;
  featured: boolean;
}
