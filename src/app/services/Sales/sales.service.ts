import { Injectable } from '@angular/core';
import {ApiService} from "../api.service";
import {Observable} from "rxjs";
import {AllProductsResponse, SalesHistoryResponse} from "../../../types";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private apiService: ApiService) {
  }


  getSalesHistory = (url: string, body: any, headers?: HttpHeaders): Observable<SalesHistoryResponse> => {
    return this.apiService.post(url, body, headers);
  }
}
