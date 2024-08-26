import { TestBed } from '@angular/core/testing';
import { WarehouseService } from './warehouse.service';
import { ApiService } from '../api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import {
  AllClientsResponse,
  AllProductsResponse,
  WarehouseQuantityHistoryResponse,
  WarehouseQuantityResponse
} from '../../../types';

describe('WarehouseService', () => {
  let service: WarehouseService;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['get']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        WarehouseService,
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });

    service = TestBed.inject(WarehouseService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products', () => {
    const mockProductsResponse: AllProductsResponse = {
      value: [{ code: 'PROD1', description: 'Product 1' }],
      formatters: null,
      contentTypes: null,
      declaredType: null,
      statusCode: 200
    };
    const testUrl = 'http://example.com/products';

    apiService.get.and.returnValue(of(mockProductsResponse));

    service.getAllProducts(testUrl).subscribe(response => {
      expect(response).toEqual(mockProductsResponse);
    });

    expect(apiService.get).toHaveBeenCalledWith(testUrl);
  });

  it('should get all clients', () => {
    const mockClientsResponse: AllClientsResponse = {
      value: [{ id: 1, name: 'Client 1' }],
      formatters: null,
      contentTypes: null,
      declaredType: null,
      statusCode: 200
    };
    const testUrl = 'http://example.com/clients';

    apiService.get.and.returnValue(of(mockClientsResponse));

    service.getAllClients(testUrl).subscribe(response => {
      expect(response).toEqual(mockClientsResponse);
    });

    expect(apiService.get).toHaveBeenCalledWith(testUrl);
  });

  it('should get warehouse quantity', () => {
    const mockQuantityResponse: WarehouseQuantityResponse = {
      contentType: null,
      serializerSettings: null,
      statusCode: 200,
      value: { quantity: 100 }
    };
    const testUrl = 'http://example.com/warehouse-quantity';

    apiService.get.and.returnValue(of(mockQuantityResponse));

    service.getWarehouseQuantity(testUrl).subscribe(response => {
      expect(response).toEqual(mockQuantityResponse);
    });

    expect(apiService.get).toHaveBeenCalledWith(testUrl);
  });

  it('should get warehouse quantity history', () => {
    const mockQuantityHistoryResponse: WarehouseQuantityHistoryResponse = {
      value: { '2023-01-01': 100, '2023-01-02': 110 }
    };
    const testUrl = 'http://example.com/warehouse-quantity-history';

    apiService.get.and.returnValue(of(mockQuantityHistoryResponse));

    service.getWarehouseQuantityHistory(testUrl).subscribe(response => {
      expect(response).toEqual(mockQuantityHistoryResponse);
    });

    expect(apiService.get).toHaveBeenCalledWith(testUrl);
  });
});
