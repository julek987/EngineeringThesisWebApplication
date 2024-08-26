import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminPanelComponent } from './admin-panel.component';
import { AdminService } from '../../services/Admin/admin.service';
import { of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Employee } from '../../../types';

describe('AdminPanelComponent', () => {
  let component: AdminPanelComponent;
  let fixture: ComponentFixture<AdminPanelComponent>;
  let mockAdminService: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockAdminService = {
      getAllEmployees: jasmine.createSpy('getAllEmployees').and.returnValue(of([])),
      deleteEmployee: jasmine.createSpy('deleteEmployee').and.returnValue(of({})),
      addNewEmployee: jasmine.createSpy('addNewEmployee').and.returnValue(of({}))
    };

    mockActivatedRoute = {
      params: of({ id: 1 })
    };

    await TestBed.configureTestingModule({
      declarations: [AdminPanelComponent],
      providers: [
        { provide: AdminService, useValue: mockAdminService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ],
      imports: [HttpClientTestingModule],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdminPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load employees on init', () => {
    const mockEmployees: Employee[] = [
      { username: 'admin1', role: 'admin', id: 1, password: 'adminPass' },
      { username: 'employee1', role: 'employee', id: 2, password: 'employeePass' }
    ];
    mockAdminService.getAllEmployees.and.returnValue(of(mockEmployees));

    component.ngOnInit();

    expect(mockAdminService.getAllEmployees).toHaveBeenCalled();
    expect(component.employees.length).toBe(2);
    expect(component.filteredEmployees.length).toBe(2);
  });

  it('should handle error when loading employees', () => {
    mockAdminService.getAllEmployees.and.returnValue(throwError('Error loading employees'));

    component.ngOnInit();

    expect(component.employees.length).toBe(0);
    expect(component.filteredEmployees.length).toBe(0);
  });

  it('should apply filter correctly', () => {
    component.employees = [
      { username: 'admin1', role: 'admin', id: 1, password: 'adminPass' },
      { username: 'employee1', role: 'employee', id: 2, password: 'employeePass' },
      { username: 'employee2', role: 'employee', id: 3, password: 'employeePass2' }
    ];

    component.adminSearchText = 'admin';
    component.employeeSearchText = 'employee1';
    component.filterAdmins();
    component.filterEmployees();

    expect(component.filteredAdmins.length).toBe(1);
    expect(component.filteredAdmins[0].username).toBe('admin1');

    expect(component.filteredRegulars.length).toBe(1);
    expect(component.filteredRegulars[0].username).toBe('employee1');
  });

  it('should select an employee when box is checked', () => {
    component.filteredEmployees = [
      { username: 'employee1', role: 'employee', id: 1, password: 'employeePass', selected: true }
    ];

    component.employeeBoxChecked();

    expect(component.selectedEmployee).toBe(component.filteredEmployees[0]);
  });

  it('should delete selected employees', () => {
    component.filteredEmployees = [
      { username: 'employee1', role: 'employee', id: 1, password: 'employeePass', selected: true }
    ];
    component.employees = [...component.filteredEmployees];

    component.deleteSelectedEmployeesClicked();

    expect(mockAdminService.deleteEmployee).toHaveBeenCalledWith('http://localhost:5282/api/User/delete/1');
    expect(component.employees.length).toBe(0);
  });

  it('should handle password mismatch when adding a new employee', () => {
    component.newEmployeePassword = 'password1';
    component.newEmployeePasswordConfirmation = 'password2';

    component.onAddEmployeeClicked();

    expect(component.passwordMismatch).toBeTrue();
    expect(mockAdminService.addNewEmployee).not.toHaveBeenCalled();
  });

  it('should handle login conflict when adding a new employee', () => {
    component.employees = [
      { username: 'existingUser', role: 'employee', id: 1, password: 'existingPass' }
    ];
    component.newEmployeeLogin = 'existingUser';
    component.newEmployeePassword = 'password';
    component.newEmployeePasswordConfirmation = 'password';

    component.onAddEmployeeClicked();

    expect(component.loginConflict).toBeTrue();
    expect(mockAdminService.addNewEmployee).not.toHaveBeenCalled();
  });

  it('should add a new employee successfully', () => {
    component.newEmployeeLogin = 'newUser';
    component.newEmployeePassword = 'password';
    component.newEmployeePasswordConfirmation = 'password';

    component.onAddEmployeeClicked();

    expect(component.passwordMismatch).toBeFalse();
    expect(component.loginConflict).toBeFalse();
    expect(mockAdminService.addNewEmployee).toHaveBeenCalled();
  });
});
