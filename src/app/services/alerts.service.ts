import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {AllAlertsResponse, AllProductsResponse, SalesHistoryResponse} from "../../types";
import {AnyCatcher} from "rxjs/internal/AnyCatcher";

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(private apiService: ApiService) {
  }

  getAllAlerts = (url: string): Observable<AllAlertsResponse> => {
    return this.apiService.get(url);
  }

  deleteAlert = (url: string): Observable<AnyCatcher> => {
    return this.apiService.delete(url);
  }

  addNewAlert = (url: string, body: any, headers?: HttpHeaders): Observable<AnyCatcher> => {
    return this.apiService.post(url, body, headers);
  }
}
