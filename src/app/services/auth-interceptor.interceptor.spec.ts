import { TestBed } from '@angular/core/testing';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { AuthInterceptor } from './auth-interceptor.interceptor';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthInterceptor],
    });
    interceptor = TestBed.inject(AuthInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add withCredentials to the request', () => {
    const httpHandlerSpy = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);
    const httpRequestStub = new HttpRequest<any>('GET', '/api/test');

    interceptor.intercept(httpRequestStub, httpHandlerSpy);

    expect(httpHandlerSpy.handle).toHaveBeenCalledWith(jasmine.objectContaining({
      withCredentials: true
    }));
  });
});
