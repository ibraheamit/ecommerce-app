import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { Favorite } from '../models/favorite.model';
import { environment } from '../../../environments/environment';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private _favoriteIds = signal<string[]>([]);
  readonly favoriteIds = this._favoriteIds.asReadonly();
  readonly favoriteCount = computed(() => this._favoriteIds().length);

  constructor(private http: HttpClient, private toastService: ToastService) {}

  loadFavorites(userId: string): Observable<Favorite[]> {
    return this.http.get<Record<string, Favorite>>(`${environment.apiUrl}/favorites.json`).pipe(
      map(res => {
        if (!res) return [];
        return Object.keys(res)
          .map(key => ({ ...res[key], id: key }))
          .filter(f => f.userId === userId);
      }),
      tap(favs => {
        this._favoriteIds.set(favs.map(f => f.productId));
      }),
      catchError(() => {
        this._favoriteIds.set([]);
        return of([]);
      })
    );
  }

  getFavoritesByUser(userId: string): Observable<Favorite[]> {
    return this.loadFavorites(userId);
  }

  isFavorite(productId: string): boolean {
    return this._favoriteIds().includes(productId);
  }

  toggleFavorite(userId: string, productId: string): Observable<Favorite | void> {
    if (this.isFavorite(productId)) {
      return this.removeFavorite(userId, productId);
    } else {
      return this.addFavorite(userId, productId);
    }
  }

  addFavorite(userId: string, productId: string): Observable<Favorite> {
    this._favoriteIds.update(ids => [...ids, productId]);
    this.toastService.success('Added to favorites!');
    return this.http.post<{name: string}>(`${environment.apiUrl}/favorites.json`, { userId, productId }).pipe(
      map(res => ({ id: res.name, userId, productId })),
      catchError(() => {
        this._favoriteIds.update(ids => ids.filter(id => id !== productId));
        return of({ id: '0', userId, productId });
      })
    );
  }

  removeFavorite(userId: string, productId: string): Observable<void> {
    this._favoriteIds.update(ids => ids.filter(id => id !== productId));
    this.toastService.info('Removed from favorites');
    return this.http.get<Record<string, Favorite>>(`${environment.apiUrl}/favorites.json`).pipe(
      tap(res => {
        if (!res) return;
        const targetFavKey = Object.keys(res).find(key => res[key].userId === userId && res[key].productId === productId);
        if (targetFavKey) {
          this.http.delete(`${environment.apiUrl}/favorites/${targetFavKey}.json`).subscribe();
        }
      }),
      map(() => undefined as void),
      catchError(() => of(undefined as any))
    );
  }

  clearFavorites(): void {
    this._favoriteIds.set([]);
  }
}
