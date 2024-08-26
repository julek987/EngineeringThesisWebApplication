import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET request', () => {
    const testUrl = 'https://api.example.com/data';
    const mockResponse = { key: 'value' };

    service.get<{ key: string }>(testUrl).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should make a POST request', () => {
    const testUrl = 'https://api.example.com/data';
    const postData = { key: 'value' };
    const mockResponse = { success: true };

    service.post<{ success: boolean }>(testUrl, postData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(postData);
    req.flush(mockResponse);
  });

  it('should make a PUT request', () => {
    const testUrl = 'https://api.example.com/data';
    const putData = { key: 'value' };
    const mockResponse = { success: true };

    service.put<{ success: boolean }>(testUrl, putData).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(putData);
    req.flush(mockResponse);
  });

  it('should make a DELETE request', () => {
    const testUrl = 'https://api.example.com/data';
    const mockResponse = { success: true };

    service.delete<{ success: boolean }>(testUrl).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

  it('should include headers in GET request if provided', () => {
    const testUrl = 'https://api.example.com/data';
    const headers = new HttpHeaders({ Authorization: 'Bearer token' });
    const mockResponse = { key: 'value' };

    service.get<{ key: string }>(testUrl, headers).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(testUrl);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer token');
    req.flush(mockResponse);
  });
});
