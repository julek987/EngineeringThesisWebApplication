import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BestsellersComponent } from './bestsellers.component';
import { WarehouseService } from '../../services/Warehouse/warehouse.service';
import { BestsellersService } from '../../services/Bestsellers/bestsellers.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Bestseller, Product } from '../../../types';

describe('BestsellersComponent', () => {
  let component: BestsellersComponent;
  let fixture: ComponentFixture<BestsellersComponent>;
  let mockWarehouseService: any;
  let mockBestsellersService: any;
  let mockActivatedRoute: any;

  const mockProducts: Product[] = [
    { code: 'prod/1', description: 'Product 1' },
    { code: 'prod/2', description: 'Product 2' },
    { code: 'prod/3', description: 'Product 3' },
  ];

  const mockBestsellers: Bestseller[] = [
    { code: 'prod/1' },
    { code: 'prod/2' }
  ];

  beforeEach(async () => {
    mockWarehouseService = jasmine.createSpyObj(['getAllProducts']);
    mockBestsellersService = jasmine.createSpyObj(['getAllBestsellers', 'addNewBestseller', 'deleteBestseller']);
    mockActivatedRoute = {
      params: of({})
    };

    mockWarehouseService.getAllProducts.and.returnValue(of({ value: mockProducts }));
    mockBestsellersService.getAllBestsellers.and.returnValue(of({ value: mockBestsellers }));
    mockBestsellersService.addNewBestseller.and.returnValue(of(void 0));
    mockBestsellersService.deleteBestseller.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      declarations: [BestsellersComponent],
      providers: [
        { provide: WarehouseService, useValue: mockWarehouseService },
        { provide: BestsellersService, useValue: mockBestsellersService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BestsellersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load bestsellers on init', () => {
    component.ngOnInit();
    expect(mockBestsellersService.getAllBestsellers).toHaveBeenCalled();
    expect(component.bestsellers.length).toBe(2);
    expect(component.filteredBestsellers.length).toBe(2);
  });

  it('should filter bestsellers based on search text', () => {
    component.searchTextBestsellers = 'prod/1';
    component.filterBestsellers();
    expect(component.filteredBestsellers.length).toBe(1);
    expect(component.filteredBestsellers[0].code).toBe('prod/1');
  });

  it('should load products and exclude bestsellers from filtered products', () => {
    component.ngOnInit();
    expect(mockWarehouseService.getAllProducts).toHaveBeenCalled();
    expect(component.products.length).toBe(1);  // Only 'prod/3' is not a bestseller
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].code).toBe('prod');
  });

  it('should filter products based on search text', () => {
    component.products = mockProducts;
    component.searchTextProducts = 'prod/3';
    component.filterProducts();
    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].code).toBe('prod/3');
  });

  it('should group products by prefix', () => {
    const groupedProducts = component.groupProductsByPrefix(mockProducts);
    expect(groupedProducts.length).toBe(1);  // All products have unique prefixes
  });

  it('should add selected products to bestsellers', () => {
    spyOn(component, 'loadBestsellers');
    component.filteredProducts = [mockProducts[2]];

    const mockElement = document.createElement('input');
    mockElement.setAttribute('id', 'product-prod/3');
    mockElement.setAttribute('type', 'checkbox');
    mockElement.checked = true;
    document.body.appendChild(mockElement);

    component.addButtonClicked();

    expect(mockBestsellersService.addNewBestseller).toHaveBeenCalledWith('http://localhost:5001/createbestseller?code=prod%2F3');
    expect(component.loadBestsellers).toHaveBeenCalled();

    document.body.removeChild(mockElement);
  });
});
