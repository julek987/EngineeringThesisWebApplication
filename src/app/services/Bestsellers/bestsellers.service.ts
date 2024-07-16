import { Injectable } from '@angular/core';
import {ApiService} from "../api.service";
import {Observable} from "rxjs";
import {AllAlertsResponse, AllBestsellersResponse} from "../../../types";
import {AnyCatcher} from "rxjs/internal/AnyCatcher";
import {HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class BestsellersService {

  constructor(private apiService: ApiService) {
  }

  getAllBestsellers = (url: string): Observable<AllBestsellersResponse> => {
    return this.apiService.get(url);
  }

  deleteBestseller = (url: string): Observable<AnyCatcher> => {
    return this.apiService.delete(url);
  }

  addNewBestseller = (url: string): Observable<AnyCatcher> => {
    return this.apiService.post(url);
  }
}
