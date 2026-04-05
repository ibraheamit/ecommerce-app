import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1055;">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="toast show align-items-center mb-2 custom-toast animate-toast-in" 
          [ngClass]="getToastClass(toast.type)"
          role="alert" 
          aria-live="assertive" 
          aria-atomic="true"
        >
          <div class="d-flex">
            <div class="toast-body d-flex align-items-center gap-2">
              <i [class]="getIconClass(toast.type)"></i>
              <span class="toast-msg">{{ toast.message }}</span>
            </div>
            <button 
              type="button" 
              class="btn-close btn-close-white me-2 m-auto" 
              (click)="toastService.remove(toast.id)" 
              aria-label="Close"
            ></button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .custom-toast {
      border: none;
      border-radius: var(--radius-md);
      color: white;
      box-shadow: 0 10px 25px rgba(0,0,0,0.15);
      min-width: 280px;
    }

    .toast-success {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    .toast-error {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }

    .toast-info {
      background: linear-gradient(135deg, #4a5cff 0%, #3144e5 100%);
    }

    .toast-warning {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    .toast-msg {
      font-weight: 600;
      font-size: 0.95rem;
      letter-spacing: 0.01em;
    }

    .animate-toast-in {
      animation: slideInUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    @keyframes slideInUp {
      from { transform: translateY(100%) scale(0.9); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  getToastClass(type: string): string {
    return 'toast-' + type;
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success': return 'bi bi-check-circle-fill fs-5';
      case 'error': return 'bi bi-x-circle-fill fs-5';
      case 'warning': return 'bi bi-exclamation-circle-fill fs-5';
      case 'info': return 'bi bi-info-circle-fill fs-5';
      default: return 'bi bi-bell-fill fs-5';
    }
  }
}
