import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {AllAlertsResponse, AllProductsResponse, SalesHistoryResponse} from "../../types";

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(private apiService: ApiService) {
  }

  getAllAlerts = (url: string): Observable<AllAlertsResponse> => {
    return this.apiService.get(url);
  }

  deleteAlert = (url: string): Observable<AllAlertsResponse> => {
    return this.apiService.delete(url);
  }
}
