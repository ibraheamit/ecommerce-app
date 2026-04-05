import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, catchError, of, tap, switchMap } from 'rxjs';
import { User, UserSession } from '../models/user.model';
import { environment } from '../../../environments/environment';

const SESSION_KEY = 'shopwave_user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _currentUser = signal<UserSession | null>(this.loadSession());

  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = computed(() => this._currentUser() !== null);
  readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');
  readonly userName = computed(() => this._currentUser()?.name ?? '');

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<{ success: boolean; message: string }> {
    return this.http.get<Record<string, User>>(`${environment.apiUrl}/users.json`).pipe(
      map(res => {
        if (!res) return { success: false, message: 'Invalid email or password' };
        const users = Object.keys(res).map(key => ({ ...res[key], id: key }));
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          const session: UserSession = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          };
          this.saveSession(session);
          this._currentUser.set(session);
          return { success: true, message: 'Login successful' };
        }
        return { success: false, message: 'Invalid email or password' };
      }),
      catchError(() => of({ success: false, message: 'Connection error. Please try again.' }))
    );
  }

  register(name: string, email: string, password: string): Observable<{ success: boolean; message: string }> {
    return this.http.get<Record<string, User>>(`${environment.apiUrl}/users.json`).pipe(
      map(res => {
        if (!res) return false;
        return Object.keys(res).some(key => res[key].email === email);
      }),
      switchMap(emailTaken => {
        if (emailTaken) {
          return of({ success: false, message: 'An account with this email already exists.' });
        }
        const newUser: Omit<User, 'id'> = {
          name,
          email,
          password,
          role: 'user',
          createdAt: new Date().toISOString()
        };
        return this.http.post<{name: string}>(`${environment.apiUrl}/users.json`, newUser).pipe(
          tap(created => {
            const session: UserSession = {
              id: created.name,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role
            };
            this.saveSession(session);
            this._currentUser.set(session);
          }),
          map(() => ({ success: true, message: 'Registration successful' }))
        );
      }),
      catchError(() => of({ success: false, message: 'Registration failed. Try again.' }))
    );
  }

  logout(): void {
    this.clearSession();
    this._currentUser.set(null);
    this.router.navigate(['/']);
  }

  getCurrentUserId(): string | null {
    return this._currentUser()?.id ?? null;
  }

  private saveSession(user: UserSession): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  private loadSession(): UserSession | null {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as UserSession;
    } catch {
      return null;
    }
  }

  private clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
  }
}
