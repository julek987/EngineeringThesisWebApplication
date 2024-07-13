import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AlertsService } from '../services/alerts.service';
import { ActivatedRoute } from '@angular/router';
import { Alert } from '../../types';

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

  constructor(
    private alertsService: AlertsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadAlerts();
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
    const productSign = this.productCodeInput.nativeElement.value;
    const thresholdQuantity = this.criticalQuantity.nativeElement.value;
    const daysBeforeExhaustion = this.leadTimeInDays.nativeElement.value;
    const analysisTime = this.analysisPeriodInDays.nativeElement.value;

    console.log('New alert data:', {
      alertName,
      productSign,
      thresholdQuantity,
      daysBeforeExhaustion,
      analysisTime
    });
  }
}
