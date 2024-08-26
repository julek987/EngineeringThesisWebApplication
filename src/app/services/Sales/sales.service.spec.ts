import { TestBed } from '@angular/core/testing';
import { SalesService } from './sales.service';
import { ApiService } from '../api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SalesHistoryResponse } from '../../../types';
import { HttpHeaders } from '@angular/common/http';

describe('SalesService', () => {
  let service: SalesService;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['post']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SalesService,
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });

    service = TestBed.inject(SalesService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get sales history', () => {
    const mockSalesHistoryResponse: SalesHistoryResponse = {
      contentType: 'application/json',
      serializerSettings: null,
      statusCode: 200,
      value: { '2023-01-01': 100, '2023-01-02': 150 }
    };
    const testUrl = 'http://example.com/sales-history';
    const testBody = { productId: 1 };
    const testHeaders = new HttpHeaders({ Authorization: 'Bearer token' });

    apiService.post.and.returnValue(of(mockSalesHistoryResponse));

    service.getSalesHistory(testUrl, testBody, testHeaders).subscribe(response => {
      expect(response).toEqual(mockSalesHistoryResponse);
    });

    expect(apiService.post).toHaveBeenCalledWith(testUrl, testBody, testHeaders);
  });

  it('should get sales history without headers', () => {
    const mockSalesHistoryResponse: SalesHistoryResponse = {
      contentType: 'application/json',
      serializerSettings: null,
      statusCode: 200,
      value: { '2023-01-01': 100, '2023-01-02': 150 }
    };
    const testUrl = 'http://example.com/sales-history';
    const testBody = { productId: 1 };

    apiService.post.and.returnValue(of(mockSalesHistoryResponse));

    service.getSalesHistory(testUrl, testBody).subscribe(response => {
      expect(response).toEqual(mockSalesHistoryResponse);
    });

    expect(apiService.post).toHaveBeenCalledWith(testUrl, testBody, undefined);
  });
});
