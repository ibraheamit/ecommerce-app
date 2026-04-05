import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // Home
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'ShopWave — Home'
  },

  // Products
  {
    path: 'products',
    loadComponent: () =>
      import('./features/products/products.component').then(m => m.ProductsComponent),
    title: 'ShopWave — Products'
  },

  // Product Detail
  {
    path: 'products/:id',
    loadComponent: () =>
      import('./features/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
    title: 'ShopWave — Product Detail'
  },

  // Cart (protected)
  {
    path: 'cart',
    loadComponent: () =>
      import('./features/cart/cart.component').then(m => m.CartComponent),
    canActivate: [authGuard],
    title: 'ShopWave — Cart'
  },

  // Checkout (protected)
  {
    path: 'checkout',
    loadComponent: () =>
      import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [authGuard],
    title: 'ShopWave — Checkout'
  },

  // Order Confirmation (protected)
  {
    path: 'order-confirmation/:id',
    loadComponent: () =>
      import('./features/checkout/order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent),
    canActivate: [authGuard],
    title: 'ShopWave — Order Confirmed'
  },

  // Auth routes
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(m => m.LoginComponent),
        title: 'ShopWave — Login'
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(m => m.RegisterComponent),
        title: 'ShopWave — Register'
      }
    ]
  },

  // Profile (protected)
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard],
    title: 'ShopWave — Profile'
  },

  // Favorites (protected)
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/favorites.component').then(m => m.FavoritesComponent),
    canActivate: [authGuard],
    title: 'ShopWave — Favorites'
  },

  // Admin Dashboard (admin only)
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./features/admin/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Admin — Dashboard'
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/admin/manage-products/manage-products.component').then(m => m.ManageProductsComponent),
        title: 'Admin — Products'
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/admin/manage-orders/manage-orders.component').then(m => m.ManageOrdersComponent),
        title: 'Admin — Orders'
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/admin/manage-users/manage-users.component').then(m => m.ManageUsersComponent),
        title: 'Admin — Users'
      }
    ]
  },

  // 404 fallback
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'ShopWave — Page Not Found'
  }
];
