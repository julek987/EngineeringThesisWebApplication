import { Injectable } from '@angular/core';
import {ApiService} from "./api.service";
import {Observable} from "rxjs";
import {AllClientsResponse, AllProductsResponse} from "../../types";

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(private apiService: ApiService) {
  }

  getAllProducts = (url: string): Observable<AllProductsResponse> => {
    return this.apiService.get(url);
  }

  getAllClients = (url: string): Observable<AllClientsResponse> => {
    return this.apiService.get(url);
  }
}
