import { TestBed } from '@angular/core/testing';
import { BestsellersService } from './bestsellers.service';
import { ApiService } from '../api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AllBestsellersResponse } from '../../../types';

describe('BestsellersService', () => {
  let service: BestsellersService;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['get', 'delete', 'post']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BestsellersService,
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });

    service = TestBed.inject(BestsellersService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all bestsellers', () => {
    const mockBestsellersResponse: AllBestsellersResponse = {
      value: [{ code: 'BEST1' }],
      formatters: null,
      contentTypes: null,
      declaredType: null,
      statusCode: 200
    };
    const testUrl = 'http://example.com/bestsellers';

    apiService.get.and.returnValue(of(mockBestsellersResponse));

    service.getAllBestsellers(testUrl).subscribe(response => {
      expect(response).toEqual(mockBestsellersResponse);
    });

    expect(apiService.get).toHaveBeenCalledWith(testUrl);
  });

  it('should delete a bestseller', () => {
    const testUrl = 'http://example.com/bestsellers/1';

    apiService.delete.and.returnValue(of(void 0));

    service.deleteBestseller(testUrl).subscribe(response => {
      expect(response).toBeUndefined(); // void 0 is equivalent to undefined
    });

    expect(apiService.delete).toHaveBeenCalledWith(testUrl);
  });

  it('should add a new bestseller', () => {
    const testUrl = 'http://example.com/bestsellers';

    apiService.post.and.returnValue(of(void 0));

    service.addNewBestseller(testUrl).subscribe(response => {
      expect(response).toBeUndefined(); // void 0 is equivalent to undefined
    });

    expect(apiService.post).toHaveBeenCalledWith(testUrl);
  });
});
