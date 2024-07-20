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
}
