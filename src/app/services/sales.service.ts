import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {Observable} from "rxjs";
import {AllProductsResponse, SalesHistoryResponse} from "../../types";

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private apiService: ApiService) {
  }


  getSalesHistory = (url: string, body: any): Observable<SalesHistoryResponse> => {
    return this.apiService.post(url, body);
  }
}
