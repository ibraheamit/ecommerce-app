import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product, ProductCategory } from '../../../core/models/product.model';

@Component({
  selector: 'app-manage-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="admin-page animate-fadeIn">
      <div class="admin-page-header">
        <div>
          <h1 class="admin-page-title">Manage Products</h1>
          <p class="admin-page-subtitle">{{ products.length }} products total</p>
        </div>
        <button class="btn-admin-primary" (click)="openAddModal()" aria-label="Add new product">
          <i class="bi bi-plus-lg"></i> Add Product
        </button>
      </div>

      <!-- Products Table -->
      <div class="admin-table-card">
        <!-- Search -->
        <div class="table-toolbar">
          <div class="table-search">
            <i class="bi bi-search search-icon-sm"></i>
            <input
              type="text"
              class="admin-search-input"
              placeholder="Search products..."
              [(ngModel)]="searchQuery"
              [ngModelOptions]="{standalone: true}"
              (input)="filterProducts()"
              aria-label="Search products"
            />
          </div>
          <select class="admin-select" [(ngModel)]="filterCategory" [ngModelOptions]="{standalone: true}" (change)="filterProducts()">
            <option value="">All Categories</option>
            @for (cat of categories; track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
        </div>

        @if (isLoading) {
          <div class="text-center py-4">
            <div class="spinner-border" style="color: var(--admin-accent);" role="status"></div>
          </div>
        } @else {
          <div class="admin-table-wrap">
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (product of filteredProducts; track product.id) {
                  <tr>
                    <td>
                      <div class="product-cell">
                        <img [src]="product.image" [alt]="product.title" class="product-thumb"
                             (error)="onImageError($event)"/>
                        <div>
                          <p class="product-cell-title">{{ product.title | slice:0:40 }}{{ product.title.length > 40 ? '...' : '' }}</p>
                          <p class="product-cell-desc">{{ product.description | slice:0:50 }}...</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="badge-custom badge-primary" style="font-size:0.7rem;">{{ product.category }}</span>
                    </td>
                    <td class="fw-700" style="color: var(--admin-accent);">\${{ product.price | number:'1.2-2' }}</td>
                    <td>
                      <span [style.color]="product.stock <= 10 ? '#f87171' : '#4ade80'">{{ product.stock }}</span>
                    </td>
                    <td>
                      <span style="color: #fbbf24;"><i class="bi bi-star-fill"></i> {{ product.rating }}</span>
                    </td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn-admin-icon edit" (click)="openEditModal(product)" aria-label="Edit product">
                          <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn-admin-icon delete" (click)="deleteProduct(product)" aria-label="Delete product">
                          <i class="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>

    <!-- Modal Overlay -->
    @if (showModal) {
      <div class="admin-modal-overlay" (click)="closeModal()">
        <div class="admin-modal" (click)="$event.stopPropagation()" role="dialog" aria-modal="true" [attr.aria-label]="editingProduct ? 'Edit product' : 'Add product'">
          <div class="modal-header-admin">
            <h5>{{ editingProduct ? 'Edit Product' : 'Add New Product' }}</h5>
            <button class="modal-close" (click)="closeModal()" aria-label="Close modal">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <form [formGroup]="productForm" (ngSubmit)="saveProduct()" novalidate>
            <div class="modal-body-admin">
              <div class="row g-3">
                <div class="col-12">
                  <label for="title" class="admin-form-label">Title *</label>
                  <input type="text" id="title" class="admin-form-control" formControlName="title"
                         placeholder="Product title" [class.invalid]="isInvalid('title')"/>
                  @if (isInvalid('title')) {
                    <span class="admin-field-error">Title is required</span>
                  }
                </div>

                <div class="col-md-6">
                  <label for="price" class="admin-form-label">Price ($) *</label>
                  <input type="number" id="price" class="admin-form-control" formControlName="price"
                         placeholder="0.00" step="0.01" [class.invalid]="isInvalid('price')"/>
                  @if (isInvalid('price')) {
                    <span class="admin-field-error">Valid price required</span>
                  }
                </div>

                <div class="col-md-6">
                  <label for="category" class="admin-form-label">Category *</label>
                  <select id="category" class="admin-form-control" formControlName="category">
                    @for (cat of categories; track cat) {
                      <option [value]="cat">{{ cat }}</option>
                    }
                  </select>
                </div>

                <div class="col-12">
                  <label for="image" class="admin-form-label">Image URL *</label>
                  <input type="url" id="image" class="admin-form-control" formControlName="image"
                         placeholder="https://images.unsplash.com/..." [class.invalid]="isInvalid('image')"/>
                  @if (productForm.get('image')?.value) {
                    <div class="image-preview mt-2">
                      <img [src]="productForm.get('image')?.value" alt="Preview" style="height:80px; border-radius: 8px; object-fit: cover;"
                           (error)="onImageError($event)"/>
                    </div>
                  }
                </div>

                <div class="col-md-6">
                  <label for="stock" class="admin-form-label">Stock</label>
                  <input type="number" id="stock" class="admin-form-control" formControlName="stock" placeholder="0"/>
                </div>

                <div class="col-md-6">
                  <label for="rating" class="admin-form-label">Rating (0–5)</label>
                  <input type="number" id="rating" class="admin-form-control" formControlName="rating"
                         step="0.1" min="0" max="5" placeholder="4.5"/>
                </div>

                <div class="col-12">
                  <label for="description" class="admin-form-label">Description *</label>
                  <textarea id="description" class="admin-form-control" formControlName="description"
                            rows="3" placeholder="Product description..." [class.invalid]="isInvalid('description')"></textarea>
                </div>

                <div class="col-12">
                  <label class="admin-checkbox-label">
                    <input type="checkbox" formControlName="featured" />
                    <span>Featured product</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="modal-footer-admin">
              <button type="button" class="btn-admin-secondary" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn-admin-primary" [disabled]="isSaving">
                @if (isSaving) {
                  <span class="spinner-border spinner-border-sm me-1"></span>
                }
                {{ editingProduct ? 'Update' : 'Create' }} Product
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    .admin-page { color: #e2e8f0; }
    .admin-page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .admin-page-title { font-size: 1.75rem; font-weight: 800; color: white; margin: 0; }
    .admin-page-subtitle { color: #64748b; margin: 0.25rem 0 0; font-size: 0.875rem; }

    .btn-admin-primary {
      background: var(--admin-accent);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      padding: 0.65rem 1.25rem;
      font-weight: 700;
      font-size: 0.875rem;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-family: var(--font-family);
      transition: all 0.2s;
    }
    .btn-admin-primary:hover { background: var(--color-primary-dark); transform: translateY(-1px); }
    .btn-admin-primary:disabled { opacity: 0.6; cursor: not-allowed; }

    .btn-admin-secondary {
      background: rgba(255,255,255,0.08);
      color: #9ca3af;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: var(--radius-md);
      padding: 0.6rem 1.25rem;
      font-weight: 600;
      font-size: 0.875rem;
      cursor: pointer;
      font-family: var(--font-family);
    }

    /* Table Card */
    .admin-table-card {
      background: var(--admin-card);
      border-radius: var(--radius-xl);
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.06);
    }

    .table-toolbar {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }

    .table-search {
      position: relative;
      flex: 1;
    }

    .search-icon-sm {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
      font-size: 0.875rem;
    }

    .admin-search-input {
      width: 100%;
      padding: 0.6rem 0.75rem 0.6rem 2.25rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: var(--radius-md);
      color: white;
      font-size: 0.875rem;
      font-family: var(--font-family);
    }

    .admin-search-input::placeholder { color: #64748b; }
    .admin-search-input:focus { outline: none; border-color: var(--admin-accent); }

    .admin-select {
      padding: 0.6rem 0.75rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: var(--radius-md);
      color: white;
      font-size: 0.875rem;
      font-family: var(--font-family);
      cursor: pointer;
    }

    .admin-select option { background: var(--admin-card); }
    .admin-select:focus { outline: none; border-color: var(--admin-accent); }

    .admin-table-wrap { overflow-x: auto; }

    .admin-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }

    .admin-table th {
      color: #64748b;
      font-weight: 700;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 0.75rem 1.25rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
      text-align: left;
    }

    .admin-table td {
      padding: 0.85rem 1.25rem;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      color: #e2e8f0;
    }

    .admin-table tr:hover td { background: rgba(255,255,255,0.02); }

    .product-cell { display: flex; align-items: center; gap: 0.85rem; }
    .product-thumb { width: 50px; height: 50px; border-radius: var(--radius-sm); object-fit: cover; flex-shrink: 0; }
    .product-cell-title { font-weight: 600; font-size: 0.875rem; margin: 0; }
    .product-cell-desc { font-size: 0.75rem; color: #64748b; margin: 0; }

    .action-buttons { display: flex; gap: 0.4rem; }

    .btn-admin-icon {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      transition: all 0.15s;
    }

    .btn-admin-icon.edit { background: rgba(74,92,255,0.15); color: #818cf8; }
    .btn-admin-icon.edit:hover { background: rgba(74,92,255,0.3); }
    .btn-admin-icon.delete { background: rgba(239,68,68,0.15); color: #f87171; }
    .btn-admin-icon.delete:hover { background: rgba(239,68,68,0.3); }

    /* Modal */
    .admin-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.7);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      backdrop-filter: blur(4px);
      animation: fadeIn 0.2s ease;
    }

    .admin-modal {
      background: #1e293b;
      border-radius: var(--radius-xl);
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      border: 1px solid rgba(255,255,255,0.1);
      animation: fadeInUp 0.25s ease;
    }

    .modal-header-admin {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }

    .modal-header-admin h5 { margin: 0; font-weight: 800; color: white; }

    .modal-close {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.25rem;
      transition: color 0.2s;
    }
    .modal-close:hover { color: white; }

    .modal-body-admin { padding: 1.5rem; }
    .modal-footer-admin {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.08);
    }

    .admin-form-label {
      display: block;
      font-size: 0.8rem;
      font-weight: 700;
      color: #9ca3af;
      margin-bottom: 0.4rem;
    }

    .admin-form-control {
      width: 100%;
      padding: 0.65rem 0.85rem;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: var(--radius-md);
      color: white;
      font-size: 0.875rem;
      font-family: var(--font-family);
      transition: border-color 0.2s;
    }

    .admin-form-control::placeholder { color: #4b5563; }
    .admin-form-control:focus { outline: none; border-color: var(--admin-accent); }
    .admin-form-control.invalid { border-color: #f87171; }
    .admin-form-control option { background: #1e293b; }

    .admin-field-error { font-size: 0.75rem; color: #f87171; margin-top: 0.25rem; display: block; }

    .admin-checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #9ca3af;
      font-size: 0.875rem;
      cursor: pointer;
    }

    .admin-checkbox-label input { width: 16px; height: 16px; accent-color: var(--admin-accent); cursor: pointer; }
  `]
})
export class ManageProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  isLoading = true;
  isSaving = false;
  showModal = false;
  editingProduct: Product | null = null;
  searchQuery = '';
  filterCategory = '';
  productForm!: FormGroup;

  categories: ProductCategory[] = ['Electronics', 'Clothing', 'Books', 'Home & Kitchen'];

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: products => {
        this.products = products;
        this.filteredProducts = products;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false)
    });
  }

  filterProducts(): void {
    let result = [...this.products];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p => p.title.toLowerCase().includes(q));
    }
    if (this.filterCategory) {
      result = result.filter(p => p.category === this.filterCategory);
    }
    this.filteredProducts = result;
  }

  initForm(product?: Product): void {
    this.productForm = this.fb.group({
      title: [product?.title || '', [Validators.required]],
      price: [product?.price || '', [Validators.required, Validators.min(0)]],
      category: [product?.category || 'Electronics', Validators.required],
      description: [product?.description || '', Validators.required],
      image: [product?.image || '', Validators.required],
      stock: [product?.stock || 0],
      rating: [product?.rating || 4.5, [Validators.min(0), Validators.max(5)]],
      featured: [product?.featured || false]
    });
  }

  openAddModal(): void {
    this.editingProduct = null;
    this.initForm();
    this.showModal = true;
  }

  openEditModal(product: Product): void {
    this.editingProduct = product;
    this.initForm(product);
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingProduct = null;
  }

  isInvalid(field: string): boolean {
    const ctrl = this.productForm.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const formValue = this.productForm.value;

    if (this.editingProduct) {
      this.productService.updateProduct(this.editingProduct.id, formValue).subscribe({
        next: () => {
          this.isSaving = false;
          this.closeModal();
          this.loadProducts();
        },
        error: () => (this.isSaving = false)
      });
    } else {
      this.productService.createProduct(formValue).subscribe({
        next: () => {
          this.isSaving = false;
          this.closeModal();
          this.loadProducts();
        },
        error: () => (this.isSaving = false)
      });
    }
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Delete "${product.title}"?`)) return;
    this.productService.deleteProduct(product.id).subscribe({
      next: () => this.loadProducts()
    });
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'https://placehold.co/50x50/1e293b/818cf8?text=?';
  }
}
