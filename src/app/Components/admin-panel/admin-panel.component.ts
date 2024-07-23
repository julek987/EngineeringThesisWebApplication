import { Component, OnInit } from '@angular/core';
import { Employee } from "../../../types";
import { AdminService } from "../../services/Admin/admin.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  adminSearchText: string = '';
  employeeSearchText: string = '';
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  filteredAdmins: Employee[] = [];
  filteredRegulars: Employee[] = [];
  selectedEmployee?: Employee;

  newEmployeeLogin: string = '';
  newEmployeePassword: string = '';
  newEmployeePasswordConfirmation: string = '';
  newEmployeeRole: string = 'Pracownik';
  passwordMismatch: boolean = false;

  constructor(
    private employeesService: AdminService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadEmployees();
    });
  }

  loadEmployees(): void {
    this.employeesService.getAllEmployees('http://localhost:5282/api/User')
      .subscribe((response: Employee[]) => {
        if (Array.isArray(response)) {
          this.employees = response.map(employee => ({
            ...employee,
            selected: false // Initialize the `selected` property if needed
          }));
          this.applyFilter(); // Initialize filtered lists
        } else {
          console.error('Invalid response structure:', response);
          this.employees = [];
          this.filteredEmployees = [];
        }
      }, error => {
        console.error('Error loading employees:', error);
        this.employees = [];
        this.filteredEmployees = [];
      });
  }

  filterAdmins(): void {
    this.applyFilter();
  }

  filterEmployees(): void {
    this.applyFilter();
  }

  private applyFilter(): void {
    const adminSearchTextLower = this.adminSearchText.toLowerCase();
    const employeeSearchTextLower = this.employeeSearchText.toLowerCase();

    this.filteredEmployees = this.employees.filter(employee =>
      employee.username.toLowerCase().includes(adminSearchTextLower) ||
      employee.username.toLowerCase().includes(employeeSearchTextLower)
    );

    this.filteredAdmins = this.employees.filter(employee =>
      employee.role === 'admin' && employee.username.toLowerCase().includes(adminSearchTextLower)
    );

    this.filteredRegulars = this.employees.filter(employee =>
      employee.role === 'employee' && employee.username.toLowerCase().includes(employeeSearchTextLower)
    );
  }

  employeeBoxChecked(): void {
    const selectedEmployees = this.filteredEmployees.filter(employee => employee.selected);

    this.selectedEmployee = selectedEmployees[0];
    console.log('Selected employee:', this.selectedEmployee);
  }

  deleteSelectedEmployeesClicked(): void {
    const selectedEmployees = this.filteredEmployees.filter(employee => employee.selected);

    selectedEmployees.forEach(employee => {
      this.employeesService.deleteEmployee(`http://localhost:5282/api/User/delete/${encodeURIComponent(employee.id)}`)
        .subscribe({
          next: () => {
            // Remove the deleted employee from both arrays
            this.employees = this.employees.filter(a => a.username !== employee.username);
            this.applyFilter(); // Update filtered employees after deletion
          },
          error: (error) => {
            console.error(`Error deleting employee ${employee.username}:`, error);
            // Handle error as per application requirements
          }
        });
    });
  }

  onAddEmployeeClicked(): void {
    const roleMapping: { [key: string]: string } = {
      'Pracownik': 'employee',
      'Admin': 'admin'
    };

    if (this.newEmployeePassword !== this.newEmployeePasswordConfirmation) {
      this.passwordMismatch = true;
      return;
    }

    this.passwordMismatch = false;

    const newEmployee = {
      username: this.newEmployeeLogin,
      password: this.newEmployeePassword,
      role: roleMapping[this.newEmployeeRole] || 'employee'
    };

    this.employeesService.addNewEmployee('http://localhost:5282/Auth/register', newEmployee)
      .subscribe({
        next: () => {
          console.log('Employee added successfully');
          this.loadEmployees(); // Refresh the list after adding a new employee
        },
        error: (error) => {
          console.error('Error adding employee:', error);
        }
      });
  }
}
