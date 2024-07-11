import { Component, OnInit } from '@angular/core';
import { AlertsService } from '../services/alerts.service';
import { ActivatedRoute } from '@angular/router';
import { Alert } from '../../types';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {
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
      .subscribe(
        (response: { value: Alert[] }) => {
          this.alerts = response.value;
          this.applyFilter(); // Apply initial filter on load
        },
        error => {
          console.error('Error loading alerts:', error);
          // Handle error as per application requirements
        }
      );
  }

  filterAlerts(): void {
    this.applyFilter();
  }

  private applyFilter(): void {
    this.filteredAlerts = this.alerts.filter(alert =>
      alert.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  deleteSelectedAlerts(): void {
    const selectedAlerts = this.filteredAlerts.filter(alert => alert.selected);

    selectedAlerts.forEach(alert => {
      this.alertsService.deleteAlert(`http://localhost:5001/deletealert?name=${encodeURIComponent(alert.name)}`)
        .subscribe(
          () => {
            // Remove the deleted alert from both arrays
            this.alerts = this.alerts.filter(a => a.name !== alert.name);
            this.applyFilter(); // Update filtered alerts after deletion
          },
          error => {
            console.error(`Error deleting alert ${alert.name}:`, error);
            // Handle error as per application requirements
          }
        );
    });
  }
}
