import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "./api.service";
import {Observable} from "rxjs";
import {AllProductsResponse} from "../../types";

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(private apiService: ApiService) {
  }

  getAllProducts = (url: string): Observable<AllProductsResponse> => {
    return this.apiService.get(url);
  }
}
