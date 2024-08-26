import { Component, OnInit } from '@angular/core';
import { Bestseller, Product, CheckAlertsResponse, FlaggedProduct } from "../../../types";
import { WarehouseService } from "../../services/Warehouse/warehouse.service";
import { ActivatedRoute, Router } from '@angular/router';
import { SalesService } from "../../services/Sales/sales.service";
import { AnalyticalService } from "../../services/Analytics/analytical.service";
import { BestsellersService } from "../../services/Bestsellers/bestsellers.service";
import { AlertsService } from "../../services/Alerts/alerts.service";
import { Observable, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {
  products: Product[] = [];
  allProducts: Product[] = [];
  filteredProducts: Product[] = [];
  searchTextProducts: string = '';
  startDate: string = '';
  endDate: string = '';
  selectedProducts: string[] = [];
  today: string = '';
  analysedModels: {
    alert: boolean;
    code: string,
    warehouseQuantity: number,
    soldUnits: number,
    analysisFactor: number
  }[] = [];
  selectedClients: { id: number, name: string }[] = [];

  bestsellers: Bestseller[] = [];
  searchTextBestsellers: string = '';
  filteredBestsellers: Bestseller[] = [];
  flaggedProducts: FlaggedProduct[] = []; // Store the flagged products

  constructor(
    private warehouseService: WarehouseService,
    private salesService: SalesService,
    private analyticalService: AnalyticalService,
    private bestsellerService: BestsellersService,
    private alertService: AlertsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(() => {
      this.loadBestsellers();
    });
    this.setTodayDate();
  }

  setTodayDate(): void {
    const today = new Date();
    this.today = today.toISOString().split('T')[0];
  }

  loadBestsellers(): void {
    this.bestsellerService.getAllBestsellers('http://localhost:5001/getbestsellers')
      .subscribe({
        next: (response: { value: Bestseller[] }) => {
          this.bestsellers = response.value;
          this.filteredBestsellers = this.bestsellers;
          this.loadProducts();
        },
        error: (error) => this.handleError('loadBestsellers', error)
      });
  }

  loadProducts(): void {
    this.warehouseService.getAllProducts('http://localhost:5001/products')
      .subscribe({
        next: (response: { value: Product[] }) => {
          this.allProducts = response.value;
          this.products = this.groupProductsByPrefix(this.allProducts).filter(product => !this.isBestseller(product.code));
          this.filteredProducts = this.products;
          this.checkAlerts();
        },
        error: (error) => this.handleError('loadProducts', error)
      });
  }

  isBestseller(productCode: string): boolean {
    return this.bestsellers.some(bestseller => bestseller.code === productCode);
  }

  filterProducts(): void {
    this.filteredProducts = this.searchTextProducts.trim() === ''
      ? this.products
      : this.products.filter(product => product.code.toLowerCase().includes(this.searchTextProducts.toLowerCase()));
  }

  groupProductsByPrefix(products: Product[]): Product[] {
    const groupedProducts: { [key: string]: Product } = {};
    products.forEach(product => {
      const prefix = this.getPrefix(product.code);
      if (!groupedProducts[prefix]) {
        groupedProducts[prefix] = {
          ...product,
          code: prefix,
          description: product.description || '' // Handle missing descriptions
        };
      }
    });
    return Object.values(groupedProducts);
  }

  getPrefix(code: string): string {
    return code.split('/').slice(0, -1).join('/');
  }

  onProductSelect(product: string, event: any): void {
    this.toggleSelection(product, event.target.checked, this.selectedProducts);
  }

  onBestsellerSelect(product: string, event: any): void {
    this.toggleSelection(product, event.target.checked, this.selectedProducts);
  }

  toggleSelection(item: string, isSelected: boolean, list: string[]): void {
    if (isSelected) {
      list.push(item);
    } else {
      const index = list.indexOf(item);
      if (index >= 0) {
        list.splice(index, 1);
      }
    }
  }

  onSelectedClientsChange(selectedClientIds: { id: number; name: string }[]): void {
    this.selectedClients = selectedClientIds;
  }

  onSubmit(): void {
    console.log('Submit button clicked');
    this.analysedModels = [];
    this.processSelectedProducts();
  }

  processSelectedProducts(): void {
    this.selectedProducts.forEach(prefix => {
      this.processProductPrefix(prefix).subscribe({
        next: (model) => this.analysedModels.push(model),
        error: (error) => this.handleError('processSelectedProducts', error)
      });
    });
  }

  processProductPrefix(prefix: string): Observable<any> {
    const matchingProducts = this.allProducts.filter(p => p.code.startsWith(prefix));

    const warehouseRequests = matchingProducts.map(product =>
      this.warehouseService.getWarehouseQuantity(`http://localhost:5001/warehouse?product=${product.code}&date=${this.today}`)
    );

    return forkJoin(warehouseRequests).pipe(
      catchError(error => {
        console.error('Error processing product prefix:', error);
        return [];
      })
    );
  }

  checkAlerts(): void {
    this.alertService.checkAlerts('http://localhost:5001/checkalerts')
      .subscribe({
        next: (response: CheckAlertsResponse) => {
          this.flaggedProducts = response.value.flaggedProducts;
        },
        error: (error) => this.handleError('checkAlerts', error)
      });
  }

  filterBestsellers(): void {
    this.filteredBestsellers = this.bestsellers.filter(bestseller =>
      bestseller.code.toLowerCase().includes(this.searchTextBestsellers.toLowerCase())
    );
  }

  showDetails(analysedModel: {
    alert: boolean;
    code: string;
    warehouseQuantity: number;
    soldUnits: number;
    analysisFactor: number;
  }): void {
    const selectedClientsNames = this.selectedClients.map(client => client.name);
    const selectedClientsIds = this.selectedClients.map(client => client.id);
    this.router.navigate(['/details'], {
      queryParams: {
        code: analysedModel.code,
        clientsNames: JSON.stringify(selectedClientsNames),
        clientsIds: JSON.stringify(selectedClientsIds),
        startDate: this.startDate,
        endDate: this.endDate,
        analysisFactor: analysedModel.analysisFactor
      }
    });
  }

  private handleError(operation: string, error: any): void {
    console.error(`${operation} failed: ${error.message}`);
  }
}
