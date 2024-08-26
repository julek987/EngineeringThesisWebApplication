import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientListComponent } from './client-list.component';
import { WarehouseService } from '../../services/Warehouse/warehouse.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Client } from '../../../types';

describe('ClientListComponent', () => {
  let component: ClientListComponent;
  let fixture: ComponentFixture<ClientListComponent>;
  let mockWarehouseService: any;

  const mockClients: Client[] = [
    { id: 1, name: 'Client A' },
    { id: 2, name: 'Client B' },
    { id: 3, name: 'Client C' }
  ];

  beforeEach(async () => {
    mockWarehouseService = jasmine.createSpyObj(['getAllClients']);
    mockWarehouseService.getAllClients.and.returnValue(of({ value: mockClients }));

    await TestBed.configureTestingModule({
      declarations: [ClientListComponent],
      providers: [
        { provide: WarehouseService, useValue: mockWarehouseService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ClientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load clients on init', () => {
    component.ngOnInit();
    expect(mockWarehouseService.getAllClients).toHaveBeenCalled();
    expect(component.clients.length).toBe(3);
    expect(component.filteredClients.length).toBe(3);
  });

  it('should filter clients based on search text', () => {
    component.searchTextClients = 'Client B';
    component.filterClients();
    expect(component.filteredClients.length).toBe(1);
    expect(component.filteredClients[0].name).toBe('Client B');
  });

  it('should add selected client to selectedClients array', () => {
    const mockEvent = { target: { checked: true } };
    component.onClientSelect(mockClients[0], mockEvent);
    expect(component.selectedClients.length).toBe(1);
    expect(component.selectedClients[0].name).toBe('Client A');
  });

  it('should remove unselected client from selectedClients array', () => {
    component.selectedClients = [{ id: 1, name: 'Client A' }];
    const mockEvent = { target: { checked: false } };
    component.onClientSelect(mockClients[0], mockEvent);
    expect(component.selectedClients.length).toBe(0);
  });

  it('should emit selectedClientsChange when clients are selected', () => {
    spyOn(component.selectedClientsChange, 'emit');
    const mockEvent = { target: { checked: true } };
    component.onClientSelect(mockClients[1], mockEvent);
    expect(component.selectedClientsChange.emit).toHaveBeenCalledWith([{ id: 2, name: 'Client B' }]);
  });

  it('should return true if client is selected', () => {
    component.selectedClients = [{ id: 2, name: 'Client B' }];
    expect(component.isSelected(2)).toBeTrue();
  });

  it('should return false if client is not selected', () => {
    component.selectedClients = [{ id: 2, name: 'Client B' }];
    expect(component.isSelected(1)).toBeFalse();
  });

  it('should emit clientsListChange after clients are loaded', () => {
    spyOn(component.clientsListChange, 'emit');
    component.emitClientList();
    expect(component.clientsListChange.emit).toHaveBeenCalledWith(mockClients);
  });
});
