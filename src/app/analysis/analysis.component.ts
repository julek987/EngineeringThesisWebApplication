import { Component, OnInit } from '@angular/core';
import { Client, Product } from "../../types";
import { WarehouseService } from "../services/warehouse.service";
import { ActivatedRoute } from '@angular/router';
import { SalesService } from "../services/sales.service";

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {
  products: Product[] = [];
  clients: Client[] = [];
  searchTextProducts: string = '';
  searchTextClients: string = '';
  filteredProducts: Product[] = [];
  filteredClients: Client[] = [];
  startDate: string = '';
  endDate: string = '';
  selectedStartDate: string = '';
  selectedEndDate: string = '';
  selectedProducts: string[] = [];
  selectedClients: string[] = [];
  selectedClientIds: number[] = [];
  fullModels: string[] = [];
  today: string = '';
  analysedModels: { code: string, warehouseQuantity: number, soldUnits: number, analysisFactor: string }[] = [];

  constructor(
    private warehouseService: WarehouseService,
    private salesService: SalesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadProducts();
      this.loadClients();
    });
    this.setTodayDate();
  }

  setTodayDate() {
    const today = new Date();
    this.today = today.toISOString().split('T')[0];
  }

  loadProducts() {
    this.warehouseService.getAllProducts('http://localhost:5001/products')
      .subscribe((response: { value: Product[] }) => {
        this.products = response.value;
        this.filteredProducts = this.groupProductsByPrefix(this.products);
      });
  }

  loadClients() {
    this.warehouseService.getAllClients('http://localhost:5001/clients')
      .subscribe((response: { value: Client[] }) => {
        this.clients = response.value;
        this.filteredClients = this.clients;
      });
  }

  filterProducts(): void {
    if (this.searchTextProducts.trim() === '') {
      this.filteredProducts = this.groupProductsByPrefix(this.products);
    } else {
      this.filteredProducts = this.groupProductsByPrefix(this.products).filter(product =>
        product.code.toLowerCase().includes(this.searchTextProducts.toLowerCase())
      );
    }
  }

  filterClients(): void {
    this.filteredClients = this.clients.filter(client =>
      client.name.toLowerCase().includes(this.searchTextClients.toLowerCase())
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

  onProductSelect(product: string, event: any): void {
    if (event.target.checked) {
      this.selectedProducts.push(product);
    } else {
      this.selectedProducts = this.selectedProducts.filter(p => p !== product);
    }
  }

  onClientSelect(clientId: number, event: any): void {
    if (event.target.checked) {
      this.selectedClientIds.push(clientId);
    } else {
      this.selectedClientIds = this.selectedClientIds.filter(id => id !== clientId);
    }
  }

  onSubmit(): void {
    console.log('Submit button clicked');

    this.analysedModels = [];

    this.selectedProducts.forEach(prefix => {
      const matchingProducts = this.products.filter(p => p.code.startsWith(prefix));
      const body = { clients: this.selectedClientIds.map(id => ({ id })) };

      matchingProducts.forEach(product => {
        this.warehouseService.getWarehouseQuantity(`http://localhost:5001/warehouse?product=${product.code}&date=${this.today}`).subscribe({
          next: (response) => {
            const warehouseQuantity = response.value.quantity;

            this.salesService.getSalesHistory(`http://localhost:5001/sales/history?product=${product.code}&from=${this.startDate}&to=${this.endDate}`, body).subscribe({
              next: (response) => {
                const soldUnits = response.value;
                const soldUnitsSum = Object.values(soldUnits).reduce((sum, value) => sum + value, 0);
                const analysisFactor = this.getAnalysisMark(product.code);

                this.analysedModels.push({
                  code: product.code,
                  warehouseQuantity: warehouseQuantity,
                  soldUnits: soldUnitsSum,
                  analysisFactor: analysisFactor
                });
              },
              error: (err) => console.error('Error in sales history response', err)
            });
          },
          error: (err) => console.error('Error in warehouse quantity response', err)
        });
      });
    });
  }

  private getAnalysisMark(code: string): string {
    return "1";
  }
}
