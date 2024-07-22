import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertsService } from '../../services/Alerts/alerts.service';
import { WarehouseService } from '../../services/Warehouse/warehouse.service';
import { ActivatedRoute } from '@angular/router';
import { Alert, Product, Client } from '../../../types';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
  @ViewChild('alertNameInput') alertNameInput!: ElementRef;
  @ViewChild('productCodeInput') productCodeInput!: ElementRef;
  @ViewChild('criticalQuantity') criticalQuantity!: ElementRef;
  @ViewChild('leadTimeInDays') leadTimeInDays!: ElementRef;
  @ViewChild('analysisPeriodInDays') analysisPeriodInDays!: ElementRef;
  @ViewChild('criticalQuantityForUpdate') criticalQuantityForUpdate!: ElementRef;
  @ViewChild('leadTimeInDaysForUpdate') leadTimeInDaysForUpdate!: ElementRef;
  @ViewChild('analysisPeriodInDaysForUpdate') analysisPeriodInDaysForUpdate!: ElementRef;

  alerts: Alert[] = [];
  searchText: string = '';
  filteredAlerts: Alert[] = [];
  selectedClients: { id: number, name: string }[] = [];
  products: Product[] = [];
  selectedAlertForUpdate?: Alert;
  clientList: Client[] = [];

  filteredProducts: Product[] = [];
  searchTextProducts: string = '';
  selectedProduct?: string;

  constructor(
    private alertsService: AlertsService,
    private warehouseService: WarehouseService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadAlerts();
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.warehouseService.getAllProducts('http://localhost:5001/products')
      .subscribe((response: { value: Product[] }) => {
        this.products = response.value;
        this.filteredProducts = this.groupProductsByPrefix(this.products);
      });
  }

  loadAlerts(): void {
    this.alertsService.getAllAlerts('http://localhost:5001/getalerts')
      .subscribe({
        next: (response: { value: Alert[] }) => {
          this.alerts = response.value;
          this.applyFilter(); // Apply initial filter on load
        },
        error: (error) => {
          console.error('Error loading alerts:', error);
          // Handle error as per application requirements
        }
      });
  }

  filterAlerts(): void {
    this.applyFilter();
  }

  private applyFilter(): void {
    this.filteredAlerts = this.alerts.filter(alert =>
      alert.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  onSelectedClientsChange(selectedClients: { id: number, name: string }[]): void {
    this.selectedClients = selectedClients;
  }

  onClientListChange(clients: Client[]): void {
    this.clientList = clients;
  }

  deleteSelectedAlertsClicked(): void {
    const selectedAlerts = this.filteredAlerts.filter(alert => alert.selected);

    selectedAlerts.forEach(alert => {
      this.alertsService.deleteAlert(`http://localhost:5001/deletealert?name=${encodeURIComponent(alert.name)}`)
        .subscribe({
          next: () => {
            // Remove the deleted alert from both arrays
            this.alerts = this.alerts.filter(a => a.name !== alert.name);
            this.applyFilter(); // Update filtered alerts after deletion
          },
          error: (error) => {
            console.error(`Error deleting alert ${alert.name}:`, error);
            // Handle error as per application requirements
          }
        });
    });
  }

  addNewAlertClicked(): void {
    const alertName = this.alertNameInput.nativeElement.value;
    const productCode = this.selectedProduct;
    const thresholdQuantity = this.criticalQuantity.nativeElement.value;
    const daysBeforeExhaustion = this.leadTimeInDays.nativeElement.value;
    const analysisTime = this.analysisPeriodInDays.nativeElement.value;

    const matchingProducts = this.products.filter(p => p.code.startsWith(<string>this.selectedProduct))
      .map(p => ({ code: p.code }));

    const clientsIdsBody = { clients: this.selectedClients.map(client => ({ id: client.id, name: client.name })) };

    const newAlertBody = {
      clients: clientsIdsBody.clients,
      products: matchingProducts
    };

    this.alertsService.addNewAlert("http://localhost:5001/createalert?name=" + alertName +
      "&analysisPeriodInDays=" + analysisTime + "&leadTimeInDays=" + daysBeforeExhaustion +
      "&criticalQuantity=" + thresholdQuantity, newAlertBody)
      .subscribe({
        next: (response: any) => {
          console.log('New alert added successfully:', response);
          this.loadAlerts();
        },
        error: (error) => {
          console.error('Error adding new alert:', error);
        }
      });
  }

  alertBoxChecked(): void {
    const selectedAlerts = this.filteredAlerts.filter(alert => alert.selected);

    // if (selectedAlerts.length === 0) {
    //   console.warn('No alerts selected for update.');
    //   return;
    // }

    if (selectedAlerts.length > 1) {
      console.warn('Please select only one alert for update.');
      return;
    }

    this.selectedAlertForUpdate = selectedAlerts[0];
    console.log('Selected alert for update:', this.selectedAlertForUpdate);
  }

  updateAlertClicked(): void {
    const updatedAlertBody = {
      clients: this.selectedAlertForUpdate?.clients,
      products: this.selectedAlertForUpdate?.products
    };
    const thresholdQuantity = this.criticalQuantityForUpdate.nativeElement.value;
    const daysBeforeExhaustion = this.leadTimeInDaysForUpdate.nativeElement.value;
    const analysisTime = this.analysisPeriodInDaysForUpdate.nativeElement.value;
    this.alertsService.updateAlert("http://localhost:5001/updatealert?name=" + this.selectedAlertForUpdate?.name +
      "&analysisPeriodInDays=" + analysisTime + "&leadTimeInDays=" + daysBeforeExhaustion +
      "&criticalQuantity=" + thresholdQuantity, updatedAlertBody).subscribe({
      next: (response: any) => {
        console.log('Alert updated successfully:', response);
        this.loadAlerts();
      },
      error: (error) => {
        console.error('Error updating alert:', error);
      }
    });
  }

  getProductCodes(alert: Alert): string {
    const baseCodes = new Set(alert.products.map(product => product.code.split('/').slice(0, 2).join('/')));
    return Array.from(baseCodes).join(', ');
  }

  getClientNames(alert: Alert): string {
    return alert.clients.map(client => {
      const clientInList = this.clientList.find(c => c.id === client.id); // Ensure correct comparison
      return clientInList ? clientInList.name : 'Unknown'; // Return name or 'Unknown'
    }).join(', ');
  }

  getFormattedLeadTime(alert: Alert): string {
    return this.formatDuration(alert.leadTime);
  }

  getFormattedAnalysisPeriod(alert: Alert): string {
    return this.formatDuration(alert.analysisPeriod);
  }

  private formatDuration(duration: string): string {
    const parts = duration.split(':'); // Split the duration by ':'
    return Math.floor(parseFloat(parts[0])).toString(); // Return the integer part only
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
      this.selectedProduct = product;
    }
  }
}
