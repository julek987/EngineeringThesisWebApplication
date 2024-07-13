import { Injectable } from '@angular/core';
import {ApiService} from "../api.service";
import {HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {SalesDynamicResponse, SalesHistoryResponse} from "../../../types";

@Injectable({
  providedIn: 'root'
})
export class AnalyticalService {

  constructor(private apiService: ApiService) {
  }

  getAnalyticSalesDynamic = (url: string, body: any, headers?: HttpHeaders): Observable<SalesDynamicResponse> => {
    return this.apiService.post(url, body, headers);
  }
}
