import { TestBed } from '@angular/core/testing';
import { AdminService } from './admin.service';
import { ApiService } from '../api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { Employee } from '../../../types';
import { HttpHeaders } from '@angular/common/http';

describe('AdminService', () => {
  let service: AdminService;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['get', 'delete', 'post']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AdminService,
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });

    service = TestBed.inject(AdminService);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all employees', () => {
    const mockEmployees: Employee[] = [
      { id: 1, username: 'employee1', password: 'password1', role: 'employee' },
      { id: 2, username: 'admin1', password: 'password2', role: 'admin' }
    ];
    const testUrl = 'http://example.com/employees';

    apiService.get.and.returnValue(of(mockEmployees));

    service.getAllEmployees(testUrl).subscribe(response => {
      expect(response).toEqual(mockEmployees);
    });

    expect(apiService.get).toHaveBeenCalledWith(testUrl);
  });

  it('should delete an employee', () => {
    const testUrl = 'http://example.com/employees/delete/1';

    apiService.delete.and.returnValue(of(void 0));

    service.deleteEmployee(testUrl).subscribe(response => {
      expect(response).toBeUndefined(); // void 0 is equivalent to undefined
    });

    expect(apiService.delete).toHaveBeenCalledWith(testUrl);
  });

  it('should add a new employee', () => {
    const testUrl = 'http://example.com/employees/add';
    const testBody = { username: 'newEmployee', password: 'newPassword', role: 'employee' };
    const testHeaders = new HttpHeaders({ Authorization: 'Bearer token' });

    apiService.post.and.returnValue(of(void 0));

    service.addNewEmployee(testUrl, testBody, testHeaders).subscribe(response => {
      expect(response).toBeUndefined(); // void 0 is equivalent to undefined
    });

    expect(apiService.post).toHaveBeenCalledWith(testUrl, testBody, testHeaders);
  });
});
