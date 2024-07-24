import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WarehouseService } from "../../services/Warehouse/warehouse.service";
import { Product } from "../../../types";
import {forkJoin, map} from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  code?: string;
  clients: string[] = [];
  clientsIds: string[] = [];
  startDate?: string;
  endDate?: string;

  allProducts: Product[] = [];
  filteredProducts: { product: Product, warehouseQuantity: number }[] = [];

  today: string;

  constructor(
    private route: ActivatedRoute,
    private warehouseService: WarehouseService,
  ) {
    const today = new Date();
    this.today = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.code = params['code'];
      this.clients = JSON.parse(params['clientsNames']);
      this.clientsIds = JSON.parse(params['clientsIds']);
      this.startDate = params['startDate'];
      this.endDate = params['endDate'];
      this.loadProducts(); // Moved inside the subscription to ensure code is loaded
    });
  }

  loadProducts() {
    this.warehouseService.getAllProducts('http://localhost:5001/products')
      .subscribe((response: { value: Product[] }) => {
        this.allProducts = response.value;
        this.filterProductsByPrefix();
      });
  }

  filterProductsByPrefix() {
    if (this.code) {
      const prefix = this.code.split('/').slice(0, -1).join('/');
      const matchingProducts = this.allProducts.filter(product => product.code.startsWith(prefix));
      this.loadWarehouseQuantities(matchingProducts);
    }
  }

  loadWarehouseQuantities(products: Product[]) {
    const requests = products.map(product =>
      this.warehouseService.getWarehouseQuantity(`http://localhost:5001/warehouse?product=${product.code}&date=${this.today}`)
        .pipe(map(response => ({ product, warehouseQuantity: response.value.quantity })))
    );

    forkJoin(requests).subscribe(results => {
      this.filteredProducts = results;
    });
  }
}
