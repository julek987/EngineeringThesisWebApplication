import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

interface LoginResponse {
  role?: string;
}

describe('LoginService', () => {
  let service: LoginService;
  let apiService: jasmine.SpyObj<ApiService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['post']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['setRole']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LoginService,
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(LoginService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login user and set role', () => {
    const testUrl = 'http://example.com/login';
    const testBody = { username: 'user', password: 'password' };
    const mockResponse: LoginResponse = { role: 'admin' };

    apiService.post.and.returnValue(of(mockResponse));

    service.loginUser(testUrl, testBody).subscribe(response => {
      // @ts-ignore
      expect(response).toEqual(mockResponse);
      expect(authService.setRole).toHaveBeenCalledWith('admin');
    });

    expect(apiService.post).toHaveBeenCalledWith(testUrl, testBody);
  });

  it('should not set role if response is invalid', () => {
    const testUrl = 'http://example.com/login';
    const testBody = { username: 'user', password: 'password' };
    const mockResponse: LoginResponse = {};

    apiService.post.and.returnValue(of(mockResponse));

    service.loginUser(testUrl, testBody).subscribe(response => {
      // @ts-ignore
      expect(response).toEqual(mockResponse);
      expect(authService.setRole).not.toHaveBeenCalled();
    });

    expect(apiService.post).toHaveBeenCalledWith(testUrl, testBody);
  });
});
