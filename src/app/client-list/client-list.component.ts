import { Component, OnInit } from '@angular/core';
import { Client } from '../../types';
import { WarehouseService } from '../services/warehouse.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTextClients: string = '';
  selectedClientIds: number[] = [];

  constructor(private warehouseService: WarehouseService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.warehouseService.getAllClients('http://localhost:5001/clients')
      .subscribe((response: { value: Client[] }) => {
        this.clients = response.value;
        this.filteredClients = this.clients;
      });
  }

  filterClients(): void {
    this.filteredClients = this.clients.filter(client =>
      client.name.toLowerCase().includes(this.searchTextClients.toLowerCase())
    );
  }

  onClientSelect(clientId: number, event: any): void {
    if (event.target.checked) {
      this.selectedClientIds.push(clientId);
    } else {
      this.selectedClientIds = this.selectedClientIds.filter(id => id !== clientId);
    }
  }
}
