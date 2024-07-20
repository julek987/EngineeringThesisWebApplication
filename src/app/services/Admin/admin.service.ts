import { Injectable } from '@angular/core';
import {ApiService} from "../api.service";
import {Observable} from "rxjs";
import {Employee} from "../../../types";
import {AnyCatcher} from "rxjs/internal/AnyCatcher";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private apiService: ApiService) {
  }

  getAllEmployees = (url: string): Observable<Employee[]> => {
    return this.apiService.get(url);
  }

  deleteEmployee = (url: string): Observable<AnyCatcher> => {
    return this.apiService.delete(url);
  }

  addNewEmployee = (url: string, body: any, headers?: HttpHeaders): Observable<AnyCatcher> => {
    return this.apiService.post(url, body, headers);
  }

}
