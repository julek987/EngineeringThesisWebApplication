import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiService} from "./api.service";
import {Observable} from "rxjs";
import {ProductQuantity} from "../../types";
import {ProductsQuantities} from "../../types";

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(private apiService: ApiService) {
  }

  getQuantity = (url: string): Observable<ProductsQuantities> => {
    return this.apiService.get(url);
  }
}
