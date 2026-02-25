import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-test',
  imports: [CommonModule, FormsModule],
  templateUrl: './test.html',
  standalone: true,
  styleUrls: ['./test.css'],
})
export class Test implements OnInit {

  products: any[] = [];
  errMsg: string = '';

  form: { name: string; price: number } = { name: '', price: 0 };
  selectedId: string | null = null;
  isEdit: boolean = false;
  // filter fields
  filterName: string = '';
  filterMin: number | null = null;
  filterMax: number | null = null;

  constructor(private _s: TestService){}

  ngOnInit(): void { 
    this.getProducts();
  }

  getProducts(filters?: { name?: string; minPrice?: number | null; maxPrice?: number | null }){
    this._s.getProducts(filters).subscribe({
      next: (data) => (this.products = Array.isArray(data) ? data : []),
      error: (err) => (this.errMsg = err.message || err),
    });
  }

  applyFilters(){
    const f: any = {};
    if (this.filterName) f.name = this.filterName;
    if (this.filterMin !== null && this.filterMin !== undefined) f.minPrice = this.filterMin;
    if (this.filterMax !== null && this.filterMax !== undefined) f.maxPrice = this.filterMax;
    this.getProducts(f);
  }

  clearFilters(){
    this.filterName = '';
    this.filterMin = null;
    this.filterMax = null;
    this.getProducts();
  }

  submit(){
    if (!this.form.name) return;
    if (this.isEdit && this.selectedId) {
      this._s.updateProduct(this.selectedId, this.form).subscribe({
        next: () => { this.reset(); this.getProducts(); },
        error: (e) => (this.errMsg = e.message || e),
      });
    } else {
      this._s.createProduct(this.form).subscribe({
        next: () => { this.reset(); this.getProducts(); },
        error: (e) => (this.errMsg = e.message || e),
      });
    }
  }

  reset(){
    this.form = { name: '', price: 0 };
    this.selectedId = null;
    this.isEdit = false;
    this.errMsg = '';
  }

  edit(p: any){
    this.selectedId = p._id || p.id;
    this.form = { name: p.name || '', price: p.price || 0 };
    this.isEdit = true;
  }

  delete(p: any){
    const id = p._id || p.id;
    if (!id) return;
    if (!confirm('Delete this product?')) return;
    this._s.deleteProduct(id).subscribe({
      next: () => this.getProducts(),
      error: (e) => (this.errMsg = e.message || e),
    });
  }
}
