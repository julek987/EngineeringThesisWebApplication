import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertsComponent } from './alerts.component';
import { AlertsService } from '../../services/Alerts/alerts.service';
import { WarehouseService } from '../../services/Warehouse/warehouse.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Alert } from '../../../types';

describe('AlertsComponent', () => {
  let component: AlertsComponent;
  let fixture: ComponentFixture<AlertsComponent>;
  let mockAlertsService: jasmine.SpyObj<AlertsService>;
  let mockWarehouseService: jasmine.SpyObj<WarehouseService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    mockAlertsService = jasmine.createSpyObj('AlertsService', ['getAllAlerts', 'deleteAlert', 'addNewAlert', 'updateAlert']);
    mockWarehouseService = jasmine.createSpyObj('WarehouseService', ['getAllProducts']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['params']);

    await TestBed.configureTestingModule({
      declarations: [AlertsComponent],
      providers: [
        { provide: AlertsService, useValue: mockAlertsService },
        { provide: WarehouseService, useValue: mockWarehouseService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore unknown elements and attributes
    }).compileComponents();

    fixture = TestBed.createComponent(AlertsComponent);
    component = fixture.componentInstance;

    // Set up initial mock data
    mockActivatedRoute.params = of({});
    // @ts-ignore
    mockAlertsService.getAllAlerts.and.returnValue(of({ value: [{ name: 'Test Alert', products: [], clients: [] }] }));
    // @ts-ignore
    mockWarehouseService.getAllProducts.and.returnValue(of({ value: [{ code: 'prod/1', description: 'Product 1' }] }));

    // Set up ElementRef mocks
    component.alertNameInput = new ElementRef({ value: 'Test Alert' });
    component.productCodeInput = new ElementRef({ value: 'prod/1' });
    component.criticalQuantity = new ElementRef({ value: '10' });
    component.leadTimeInDays = new ElementRef({ value: '5' });
    component.analysisPeriodInDays = new ElementRef({ value: '30' });
    component.criticalQuantityForUpdate = new ElementRef({ value: '15' });
    component.leadTimeInDaysForUpdate = new ElementRef({ value: '7' });
    component.analysisPeriodInDaysForUpdate = new ElementRef({ value: '60' });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load alerts and products on init', () => {
    fixture.detectChanges(); // Triggers ngOnInit
    expect(mockAlertsService.getAllAlerts).toHaveBeenCalled();
    expect(mockWarehouseService.getAllProducts).toHaveBeenCalled();
    expect(component.alerts.length).toBe(1); // Expect one alert to be loaded
    expect(component.products.length).toBe(1); // Expect one product to be loaded
  });

  it('should filter alerts based on search text', () => {
    component.searchText = 'Test';
    component.applyFilter();
    expect(component.filteredAlerts.length).toBe(0);
  });

  it('should delete selected alerts', () => {
    component.filteredAlerts = [{
      name: 'Test Alert', selected: true, products: [], clients: [],
      analysisPeriod: '',
      leadTime: '',
      criticalQuantity: 0
    }];
    // @ts-ignore
    mockAlertsService.deleteAlert.and.returnValue(of(void 0));

    component.deleteSelectedAlertsClicked();

    expect(mockAlertsService.deleteAlert).toHaveBeenCalledWith('http://localhost:5001/deletealert?name=Test%20Alert');
    expect(component.alerts.length).toBe(0); // Expect the alert list to be empty after deletion
  });

  it('should add a new alert', () => {
    component.selectedProduct = 'prod/1';
    component.selectedClients = [{ id: 1, name: 'Client 1' }];
    // @ts-ignore
    mockAlertsService.addNewAlert.and.returnValue(of(void 0));

    component.addNewAlertClicked();

    expect(mockAlertsService.addNewAlert).toHaveBeenCalled();
    const calledWithBody = mockAlertsService.addNewAlert.calls.mostRecent().args[1];
    expect(calledWithBody.products.length).toBe(0);
  });

  it('should update an existing alert', () => {
    component.selectedAlertForUpdate = {
      name: 'Test Alert',
      selected: true,
      products: [{
        code: 'prod/1',
        description: 'Product 1' // Original Product object
      }],
      clients: [{ id: 1, name: 'Client 1' }],
      leadTime: '5:00',
      analysisPeriod: '30:00',
      criticalQuantity: 10
    };
    // @ts-ignore
    mockAlertsService.updateAlert.and.returnValue(of(void 0));

    component.updateAlertClicked();

    expect(mockAlertsService.updateAlert).toHaveBeenCalled();
    const calledWithBody = mockAlertsService.updateAlert.calls.mostRecent().args[1];
    expect(calledWithBody.products.length).toBe(1);
  });

  it('should format duration correctly', () => {
    const formattedDuration = component.getFormattedLeadTime({ leadTime: '10:00' } as Alert);
    expect(formattedDuration).toBe('10');
  });

  it('should filter products based on search text', () => {
    component.searchTextProducts = 'prod/1';
    component.filterProducts();
    expect(component.filteredProducts.length).toBe(0);
  });
});
