import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TestService } from '../services/test.service';

@Component({
  selector: 'app-test',
  imports: [CommonModule],
  templateUrl: './test.html',
  standalone: true,
  styleUrls: ['./test.css'],
})
export class Test implements OnInit {

  products: any;
  errMsg: string = '';

  constructor(private _s: TestService){}

  ngOnInit(): void { 
    this.getProducts();
  }

  getProducts(){
    this._s.getProducts().subscribe({
      next: (data) => (this.products = data),
      error: (err) => (this.errMsg = err),
    });
  }
}
