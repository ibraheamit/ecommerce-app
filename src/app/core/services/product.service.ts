import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProductForm, ProductCategory } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(category?: string, search?: string): Observable<Product[]> {
    return this.http.get<Record<string, Product>>(`${environment.apiUrl}/products.json`).pipe(
      map(res => {
        if (!res) return [];
        let arr = Object.keys(res).map(key => ({ ...res[key], id: key }));
        if (category && category !== 'All') {
          arr = arr.filter(p => p.category === category);
        }
        if (search) {
          arr = arr.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
        }
        return arr;
      })
    );
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Record<string, Product>>(`${environment.apiUrl}/products.json`).pipe(
      map(res => {
        if (!res) return [];
        return Object.keys(res).map(key => ({ ...res[key], id: key })).filter(p => p.featured);
      })
    );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/products/${id}.json`).pipe(
      map(res => ({ ...res, id }))
    );
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.getProducts(category);
  }

  createProduct(product: ProductForm): Observable<Product> {
    return this.http.post<{name: string}>(`${environment.apiUrl}/products.json`, product).pipe(
      map(res => ({ ...product, id: res.name } as Product))
    );
  }

  updateProduct(id: string, product: Partial<ProductForm>): Observable<Product> {
    return this.http.patch<Product>(`${environment.apiUrl}/products/${id}.json`, product).pipe(
      map(res => ({ ...res, id }))
    );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/products/${id}.json`);
  }
}
