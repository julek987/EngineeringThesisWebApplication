import { TestBed } from '@angular/core/testing';
import { AlertsService } from './alerts.service';
import { ApiService } from '../api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AllAlertsResponse, CheckAlertsResponse } from '../../../types';
import { HttpHeaders } from '@angular/common/http';

describe('AlertsService', () => {
  let service: AlertsService;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['get', 'delete', 'post', 'put']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AlertsService,
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });

    service = TestBed.inject(AlertsService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all alerts', () => {
    const mockAllAlertsResponse: AllAlertsResponse = {
      value: [
        { name: 'Alert 1', products: [], clients: [], analysisPeriod: '30', leadTime: '7', criticalQuantity: 10 }
      ],
      formatters: null,
      contentTypes: null,
      declaredType: null,
      statusCode: 200
    };
    const testUrl = 'http://example.com/alerts';

    apiService.get.and.returnValue(of(mockAllAlertsResponse));

    service.getAllAlerts(testUrl).subscribe(response => {
      expect(response).toEqual(mockAllAlertsResponse);
    });

    expect(apiService.get).toHaveBeenCalledWith(testUrl);
  });

  it('should delete an alert', () => {
    const testUrl = 'http://example.com/alerts/delete';

    apiService.delete.and.returnValue(of(void 0));

    service.deleteAlert(testUrl).subscribe(response => {
      expect(response).toBeUndefined(); // void 0 is equivalent to undefined
    });

    expect(apiService.delete).toHaveBeenCalledWith(testUrl);
  });

  it('should add a new alert', () => {
    const testUrl = 'http://example.com/alerts/add';
    const testBody = { name: 'New Alert' };
    const testHeaders = new HttpHeaders({ Authorization: 'Bearer token' });

    apiService.post.and.returnValue(of(void 0));

    service.addNewAlert(testUrl, testBody, testHeaders).subscribe(response => {
      expect(response).toBeUndefined(); // void 0 is equivalent to undefined
    });

    expect(apiService.post).toHaveBeenCalledWith(testUrl, testBody, testHeaders);
  });

  it('should update an alert', () => {
    const testUrl = 'http://example.com/alerts/update';
    const testBody = { name: 'Updated Alert' };
    const testHeaders = new HttpHeaders({ Authorization: 'Bearer token' });

    apiService.put.and.returnValue(of(void 0));

    service.updateAlert(testUrl, testBody, testHeaders).subscribe(response => {
      expect(response).toBeUndefined(); // void 0 is equivalent to undefined
    });

    expect(apiService.put).toHaveBeenCalledWith(testUrl, testBody, testHeaders);
  });

  it('should check alerts', () => {
    const mockCheckAlertsResponse: CheckAlertsResponse = {
      value: {
        flaggedProducts: [{ code: 'PROD1', description: 'Product 1' }]
      },
      formatters: [],
      contentTypes: [],
      declaredType: null,
      statusCode: 200
    };
    const testUrl = 'http://example.com/alerts/check';

    apiService.get.and.returnValue(of(mockCheckAlertsResponse));

    service.checkAlerts(testUrl).subscribe(response => {
      expect(response).toEqual(mockCheckAlertsResponse);
    });

    expect(apiService.get).toHaveBeenCalledWith(testUrl);
  });
});
