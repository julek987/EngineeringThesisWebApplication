import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WarehouseService } from "../../services/Warehouse/warehouse.service";
import { Product } from "../../../types";
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
  filteredProducts: {
    product: Product,
    warehouseQuantity: number,
    warehouseQuantityHistory: { date: string, quantity: number }[]
  }[] = [];

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
      this.loadProducts();
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
      this.loadWarehouseData(matchingProducts);
    }
  }

  loadWarehouseData(products: Product[]) {
    const requests = products.map(product => {
      const quantityRequest = this.warehouseService.getWarehouseQuantity(`http://localhost:5001/warehouse?product=${product.code}&date=${this.today}`)
        .pipe(map(response => response.value.quantity));

      const historyRequest = this.warehouseService.getWarehouseQuantityHistory(`http://localhost:5001/warehouse/history?product=${product.code}&from=${this.startDate}&to=${this.endDate}`)
        .pipe(map(response => Object.keys(response.value).map(date => ({ date, quantity: response.value[date] }))));

      return forkJoin([quantityRequest, historyRequest]).pipe(
        map(([quantity, history]) => ({
          product,
          warehouseQuantity: quantity,
          warehouseQuantityHistory: history
        }))
      );
    });

    forkJoin(requests).subscribe(results => {
      this.filteredProducts = results;
    });
  }
}
