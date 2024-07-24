import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WarehouseService } from "../../services/Warehouse/warehouse.service";
import { SalesService } from "../../services/Sales/sales.service";
import { Product } from "../../../types";
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { LegendPosition } from '@swimlane/ngx-charts';

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
  analysisFactor?: number;

  allProducts: Product[] = [];
  filteredProducts: {
    product: Product,
    warehouseQuantity: number,
    warehouseQuantityHistory: { date: string, quantity: number }[],
    salesHistory: { date: string, quantity: number }[]
  }[] = [];

  today: string;

  // Chart data
  public combinedWarehouseChartData: any[] = [];
  public combinedSalesChartData: any[] = [];
  public view: [number, number] = [700, 400];  // Ensure view has exactly 2 elements
  public legend: boolean = true;
  public legendPosition: LegendPosition = LegendPosition.Right; // Use enum
  public showLabels: boolean = true;
  public animations: boolean = true;
  public xAxis: boolean = true;
  public yAxis: boolean = true;
  public showYAxisLabel: boolean = true;
  public showXAxisLabel: boolean = true;
  public xAxisLabel: string = 'Date';
  public yAxisLabel: string = 'Quantity';
  public timeline: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private warehouseService: WarehouseService,
    private salesService: SalesService
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
      this.analysisFactor = params['analysisFactor'];
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
      this.loadData(matchingProducts);
    }
  }

  loadData(products: Product[]) {
    const requests = products.map(product => {
      const quantityRequest = this.warehouseService.getWarehouseQuantity(`http://localhost:5001/warehouse?product=${product.code}&date=${this.today}`)
        .pipe(map(response => response.value.quantity));

      const historyRequest = this.warehouseService.getWarehouseQuantityHistory(`http://localhost:5001/warehouse/history?product=${product.code}&from=${this.startDate}&to=${this.endDate}`)
        .pipe(map(response => Object.keys(response.value).map(date => ({ date, quantity: response.value[date] }))));

      const salesHistoryRequest = this.salesService.getSalesHistory(`http://localhost:5001/sales/history?product=${product.code}&from=${this.startDate}&to=${this.endDate}`, {
        clients: this.clientsIds.map(id => ({ id }))
      }).pipe(map(response => Object.keys(response.value).map(date => ({ date, quantity: response.value[date] }))));

      return forkJoin([quantityRequest, historyRequest, salesHistoryRequest]).pipe(
        map(([quantity, history, salesHistory]) => ({
          product,
          warehouseQuantity: quantity,
          warehouseQuantityHistory: history,
          salesHistory
        }))
      );
    });

    forkJoin(requests).subscribe(results => {
      this.filteredProducts = results;
      this.updateCharts();
    });
  }

  updateCharts() {
    this.combinedWarehouseChartData = this.filteredProducts.map(item => ({
      name: item.product.code,
      series: item.warehouseQuantityHistory.map(history => ({
        name: history.date,
        value: history.quantity
      }))
    }));

    this.combinedSalesChartData = this.filteredProducts.map(item => ({
      name: item.product.code,
      series: item.salesHistory.map(history => ({
        name: history.date,
        value: history.quantity
      }))
    }));
  }
}
