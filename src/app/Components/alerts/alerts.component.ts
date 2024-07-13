import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertsService } from '../../services/Alerts/alerts.service';
import {WarehouseService} from "../../services/Warehouse/warehouse.service";
import { ActivatedRoute } from '@angular/router';
import {Alert, Product} from '../../../types';

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

  alerts: Alert[] = [];
  searchText: string = '';
  filteredAlerts: Alert[] = [];
  selectedClientIds: number[] = [];
  products: Product[] = [];

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

  loadProducts(): void{
    this.warehouseService.getAllProducts('http://localhost:5001/products')
      .subscribe((response: { value: Product[] }) => {
        this.products = response.value;
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

  onSelectedClientsChange(selectedClientIds: number[]): void {
    this.selectedClientIds = selectedClientIds;
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
    const productCode = this.productCodeInput.nativeElement.value;
    const thresholdQuantity = this.criticalQuantity.nativeElement.value;
    const daysBeforeExhaustion = this.leadTimeInDays.nativeElement.value;
    const analysisTime = this.analysisPeriodInDays.nativeElement.value;

    const matchingProducts = this.products.filter(p => p.code.startsWith(productCode))
      .map(p => ({ code: p.code }));

    const clientsIdsBody = { clients: this.selectedClientIds.map(id => ({ id })) };

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


  updateAlertClicked(): void {
    const selectedAlerts = this.filteredAlerts.filter(alert => alert.selected);

    if (selectedAlerts.length === 0) {
      console.warn('No alerts selected for update.');
      return;
    }

    if (selectedAlerts.length > 1) {
      console.warn('Please select only one alert for update.');
      return;
    }

    let selectedAlertForUpdate = selectedAlerts[0];
    console.log(selectedAlertForUpdate);
  }
}
