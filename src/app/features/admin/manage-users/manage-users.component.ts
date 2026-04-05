import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { User } from '../../../core/models/user.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page animate-fadeIn">
      <div class="admin-page-header">
        <div>
          <h1 class="admin-page-title">Manage Users</h1>
          <p class="admin-page-subtitle">{{ users.length }} registered users</p>
        </div>
      </div>

      <div class="admin-table-card">
        @if (isLoading) {
          <div class="text-center py-4">
            <div class="spinner-border" style="color: var(--admin-accent);" role="status"></div>
          </div>
        } @else {
          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                @for (user of users; track user.id) {
                  <tr>
                    <td><span style="color: #64748b; font-family: monospace;">#{{ user.id }}</span></td>
                    <td>
                      <div class="user-cell">
                        <div class="user-avatar-sm" [style.background]="user.role === 'admin' ? 'rgba(124,58,237,0.2)' : 'rgba(74,92,255,0.2)'"
                             [style.color]="user.role === 'admin' ? '#a78bfa' : '#818cf8'">
                          {{ user.name.charAt(0).toUpperCase() }}
                        </div>
                        <span class="fw-600">{{ user.name }}</span>
                      </div>
                    </td>
                    <td style="color: #64748b;">{{ user.email }}</td>
                    <td>
                      <span class="badge-custom" [class]="user.role === 'admin' ? 'badge-primary' : 'badge-success'"
                            style="font-size: 0.7rem;">
                        <i [class]="user.role === 'admin' ? 'bi bi-shield-check' : 'bi bi-person-check'"></i>
                        {{ user.role }}
                      </span>
                    </td>
                    <td style="color: #64748b; font-size: 0.8rem;">
                      {{ user.createdAt ? (user.createdAt | date:'mediumDate') : 'N/A' }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .admin-page { color: #e2e8f0; }
    .admin-page-header { display: flex; justify-content: space-between; margin-bottom: 2rem; }
    .admin-page-title { font-size: 1.75rem; font-weight: 800; color: white; margin: 0; }
    .admin-page-subtitle { color: #64748b; margin: 0.25rem 0 0; }

    .admin-table-card {
      background: var(--admin-card);
      border-radius: var(--radius-xl);
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.06);
    }

    .admin-table-wrap { overflow-x: auto; }
    .admin-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
    .admin-table th {
      color: #64748b; font-weight: 700; font-size: 0.7rem; text-transform: uppercase;
      letter-spacing: 0.06em; padding: 0.75rem 1.25rem;
      border-bottom: 1px solid rgba(255,255,255,0.06); text-align: left;
    }
    .admin-table td {
      padding: 0.85rem 1.25rem;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      color: #e2e8f0;
    }
    .admin-table tr:hover td { background: rgba(255,255,255,0.02); }

    .user-cell { display: flex; align-items: center; gap: 0.6rem; }
    .user-avatar-sm {
      width: 34px; height: 34px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.85rem; font-weight: 700; flex-shrink: 0;
    }
  `]
})
export class ManageUsersComponent implements OnInit {
  users: User[] = [];
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<User[]>(`${environment.apiUrl}/users`).subscribe({
      next: users => {
        // Never expose passwords in admin view
        this.users = users.map(u => ({ ...u, password: '***' }));
        this.isLoading = false;
      },
      error: () => (this.isLoading = false)
    });
  }
}
