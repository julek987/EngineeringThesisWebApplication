import {Component, OnInit} from '@angular/core';
import {WarehouseService} from "./services/warehouse.service";
import {Product} from "../types";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  products: Product[] = [];
  searchText: string = '';
  filteredProducts: Product[] = [];

  constructor(private warehouseService: WarehouseService) { }

  ngOnInit(): void {
    this.warehouseService.getAllProducts('http://localhost:5001/products')
      .subscribe((response: { value: Product[] }) => {
        this.products = response.value;
        this.filteredProducts = this.products;
      });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product =>
      product.code.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
