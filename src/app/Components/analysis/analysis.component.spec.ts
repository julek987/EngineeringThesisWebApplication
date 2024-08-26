import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalysisComponent } from './analysis.component';
import { WarehouseService } from '../../services/Warehouse/warehouse.service';
import { SalesService } from '../../services/Sales/sales.service';
import { AnalyticalService } from '../../services/Analytics/analytical.service';
import { BestsellersService } from '../../services/Bestsellers/bestsellers.service';
import { AlertsService } from '../../services/Alerts/alerts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { Product } from '../../../types';

describe('AnalysisComponent', () => {
  let component: AnalysisComponent;
  let fixture: ComponentFixture<AnalysisComponent>;

  let mockWarehouseService: jasmine.SpyObj<WarehouseService>;
  let mockSalesService: jasmine.SpyObj<SalesService>;
  let mockAnalyticalService: jasmine.SpyObj<AnalyticalService>;
  let mockBestsellersService: jasmine.SpyObj<BestsellersService>;
  let mockAlertsService: jasmine.SpyObj<AlertsService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: ActivatedRoute;

  beforeEach(async () => {
    mockWarehouseService = jasmine.createSpyObj('WarehouseService', ['getAllProducts', 'getWarehouseQuantity']);
    mockSalesService = jasmine.createSpyObj('SalesService', ['getSalesHistory']);
    mockAnalyticalService = jasmine.createSpyObj('AnalyticalService', ['getAnalyticSalesDynamic']);
    mockBestsellersService = jasmine.createSpyObj('BestsellersService', ['getAllBestsellers']);
    mockAlertsService = jasmine.createSpyObj('AlertsService', ['checkAlerts']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = new ActivatedRoute();

    // Set up the mock methods to return observables
    // @ts-ignore
    mockBestsellersService.getAllBestsellers.and.returnValue(of({ value: [{ code: 'prod/1' }] }));
    // @ts-ignore
    mockWarehouseService.getAllProducts.and.returnValue(of({ value: [{ code: 'prod/1/size', description: 'Product 1' }, { code: 'prod/2/size', description: 'Product 2' }] }));

    await TestBed.configureTestingModule({
      declarations: [AnalysisComponent],
      providers: [
        { provide: WarehouseService, useValue: mockWarehouseService },
        { provide: SalesService, useValue: mockSalesService },
        { provide: AnalyticalService, useValue: mockAnalyticalService },
        { provide: BestsellersService, useValue: mockBestsellersService },
        { provide: AlertsService, useValue: mockAlertsService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter }
      ],
      imports: [RouterTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysisComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter products by search text', () => {
    component.products = [
      {
        code: 'prod/1',
        description: null
      },
      {
        code: 'prod/2',
        description: null
      },
      {
        code: 'other/1',
        description: null
      }
    ];
    component.searchTextProducts = 'prod';
    component.filterProducts();

    expect(component.filteredProducts.length).toBe(2);
  });

  it('should group products by prefix', () => {
    const mockProducts: Product[] = [
      { code: 'prod/1', description: 'Product 1' },
      { code: 'prod/2', description: 'Product 2' },
      { code: 'prod/3', description: 'Product 3' }
    ];

    const grouped = component.groupProductsByPrefix(mockProducts);

    expect(grouped.length).toBe(1);
    expect(grouped[0].code).toBe('prod');
  });

  it('should check alerts and flag products', () => {
    const mockFlaggedProducts = [{ code: 'prod/1' }];
    // @ts-ignore
    mockAlertsService.checkAlerts.and.returnValue(of({ value: { flaggedProducts: mockFlaggedProducts } }));

    component.checkAlerts();

    expect(mockAlertsService.checkAlerts).toHaveBeenCalled();
    expect(component.flaggedProducts.length).toBe(1);
  });

  it('should navigate to details page on showDetails', () => {
    component.selectedClients = [{ id: 1, name: 'Client A' }];
    component.startDate = '2023-01-01';
    component.endDate = '2023-12-31';

    const analysedModel = {
      alert: false,
      code: 'prod/1',
      warehouseQuantity: 100,
      soldUnits: 50,
      analysisFactor: 2
    };

    component.showDetails(analysedModel);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/details'], {
      queryParams: {
        code: 'prod/1',
        clientsNames: JSON.stringify(['Client A']),
        clientsIds: JSON.stringify([1]),
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        analysisFactor: 2
      }
    });
  });

  it('should handle product selection', () => {
    const mockEvent = { target: { checked: true } };
    component.onProductSelect('prod/1', mockEvent);
    expect(component.selectedProducts).toContain('prod/1');

    mockEvent.target.checked = false;
    component.onProductSelect('prod/1', mockEvent);
    expect(component.selectedProducts).not.toContain('prod/1');
  });

  it('should handle bestseller selection', () => {
    const mockEvent = { target: { checked: true } };
    component.onBestsellerSelect('prod/1', mockEvent);
    expect(component.selectedProducts).toContain('prod/1');

    mockEvent.target.checked = false;
    component.onBestsellerSelect('prod/1', mockEvent);
    expect(component.selectedProducts).not.toContain('prod/1');
  });
});
