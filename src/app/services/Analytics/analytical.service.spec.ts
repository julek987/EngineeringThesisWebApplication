import { TestBed } from '@angular/core/testing';
import { AnalyticalService } from './analytical.service';
import { ApiService } from '../api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SalesDynamicResponse } from '../../../types';
import { HttpHeaders } from '@angular/common/http';

describe('AnalyticalService', () => {
  let service: AnalyticalService;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['post']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AnalyticalService,
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });

    service = TestBed.inject(AnalyticalService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get analytic sales dynamic', () => {
    const testUrl = 'http://example.com/analytic-sales-dynamic';
    const testBody = { productId: 1 };
    const testHeaders = new HttpHeaders({ Authorization: 'Bearer token' });
    const mockResponse: SalesDynamicResponse = {
      contentType: 'application/json',
      serializerSettings: null,
      statusCode: 200,
      value: { value: 150, name: 'Product A' }
    };

    apiService.post.and.returnValue(of(mockResponse));

    service.getAnalyticSalesDynamic(testUrl, testBody, testHeaders).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(apiService.post).toHaveBeenCalledWith(testUrl, testBody, testHeaders);
  });

  it('should get analytic sales dynamic without headers', () => {
    const testUrl = 'http://example.com/analytic-sales-dynamic';
    const testBody = { productId: 1 };
    const mockResponse: SalesDynamicResponse = {
      contentType: 'application/json',
      serializerSettings: null,
      statusCode: 200,
      value: { value: 150, name: 'Product A' }
    };

    apiService.post.and.returnValue(of(mockResponse));

    service.getAnalyticSalesDynamic(testUrl, testBody).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    expect(apiService.post).toHaveBeenCalledWith(testUrl, testBody, undefined);
  });
});
