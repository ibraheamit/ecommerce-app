import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Order } from '../models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) {}

  createOrder(order: Omit<Order, 'id'>): Observable<Order> {
    return this.http.post<{name: string}>(`${environment.apiUrl}/orders.json`, order).pipe(
      map(res => ({ ...order, id: res.name } as Order))
    );
  }

  getOrdersByUser(userId: string): Observable<Order[]> {
    return this.http.get<Record<string, Order>>(`${environment.apiUrl}/orders.json`).pipe(
      map(res => {
        if (!res) return [];
        return Object.keys(res)
          .map(key => ({ ...res[key], id: key }))
          .filter(o => o.userId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      })
    );
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Record<string, Order>>(`${environment.apiUrl}/orders.json`).pipe(
      map(res => {
        if (!res) return [];
        return Object.keys(res)
          .map(key => ({ ...res[key], id: key }))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      })
    );
  }

  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this.http.patch<Order>(`${environment.apiUrl}/orders/${id}.json`, { status }).pipe(
      map(res => ({ ...res, id }))
    );
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${environment.apiUrl}/orders/${id}.json`).pipe(
      map(res => ({ ...res, id }))
    );
  }
}
