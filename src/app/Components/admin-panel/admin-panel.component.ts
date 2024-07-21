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
  searchText: string = '';
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  selectedEmployee?: Employee;

  newEmployeeLogin: string = '';
  newEmployeePassword: string = '';
  newEmployeeRole: string = 'Pracownik';

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
          this.filteredEmployees = [...this.employees]; // Initialize filteredEmployees
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

  filterEmployees(): void {
    this.applyFilter();
  }

  private applyFilter(): void {
    this.filteredEmployees = this.employees.filter(employee =>
      employee.username.toLowerCase().includes(this.searchText.toLowerCase())
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

  translateRole(role: string): string {
    const roleTranslation: { [key: string]: string } = {
      'employee': 'Pracownik',
      'admin': 'Admin'
    };
    return roleTranslation[role] || role;
  }
}
