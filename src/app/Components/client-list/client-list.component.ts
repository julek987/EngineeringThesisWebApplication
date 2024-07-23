import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Client } from '../../../types';
import { WarehouseService } from '../../services/Warehouse/warehouse.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTextClients: string = '';
  selectedClients: { id: number, name: string }[] = [];

  @Input() isInAnalysisView: boolean = false;
  @Input() isInAlertsView: boolean = false;

  @Output() selectedClientsChange = new EventEmitter<{ id: number, name: string }[]>();
  @Output() clientsListChange = new EventEmitter<Client[]>();

  constructor(private warehouseService: WarehouseService) {}

  ngOnInit(): void {
    this.loadClients();

  }

  loadClients() {
    this.warehouseService.getAllClients('http://localhost:5001/clients')
      .subscribe((response: { value: Client[] }) => {
        this.clients = response.value;
        this.filteredClients = this.clients;
        this.emitClientList()
      });
  }

  filterClients(): void {
    this.filteredClients = this.clients.filter(client =>
      client.name.toLowerCase().includes(this.searchTextClients.toLowerCase())
    );
  }

  onClientSelect(client: Client, event: any): void {
    if (event.target.checked) {
      this.selectedClients.push({ id: client.id, name: client.name });
    } else {
      this.selectedClients = this.selectedClients.filter(c => c.id !== client.id);
    }

    // Emit selected clients to parent component
    this.selectedClientsChange.emit(this.selectedClients);
  }

  isSelected(clientId: number): boolean {
    return this.selectedClients.some(client => client.id === clientId);
  }

  emitClientList() {
    this.clientsListChange.emit(this.filteredClients);
  }
}
