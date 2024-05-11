import {Component, OnInit} from '@angular/core';
import {WarehouseService} from "./services/warehouse.service";
import {Client, Product} from "../types";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  products: Product[] = [];
  clients: Client[] = [];
  searchTextProducts: string = '';
  searchTextClients: string = '';
  filteredProducts: Product[] = [];
  filteredClients: Client[] = [];

  constructor(private warehouseService: WarehouseService) { }

  ngOnInit(): void {
    this.warehouseService.getAllProducts('http://localhost:5001/products')
      .subscribe((response: { value: Product[] }) => {
        this.products = this.groupProductsByPrefix(response.value);
        this.filteredProducts = this.products;
      });

    this.warehouseService.getAllClients('http://localhost:5001/clients')
      .subscribe((response: { value: Client[] }) => {
        this.clients = response.value;
        this.filteredClients = this.clients;
      });
  }

  filterProducts(): void {
    this.filteredProducts = this.products.filter(product =>
      product.code.toLowerCase().includes(this.searchTextProducts.toLowerCase())
    );
  }

  filterClients(): void {
    this.filteredClients = this.clients.filter(product =>
      product.name.toLowerCase().includes(this.searchTextClients.toLowerCase())
    );
  }

  groupProductsByPrefix(products: Product[]): Product[] {
    const groupedProducts: { [key: string]: Product } = {};
    products.forEach(product => {
      const parts = product.code.split('/');
      const prefix = parts.slice(0, -1).join('/'); // Extract prefix without size
      if (!groupedProducts[prefix]) {
        // If prefix not found, add it
        groupedProducts[prefix] = {
          ...product,
          code: prefix // Update code to remove size information
        };
      }
    });
    return Object.values(groupedProducts);
  }
}
