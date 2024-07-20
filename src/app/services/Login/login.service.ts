import { Injectable } from '@angular/core';
import {ApiService} from "../api.service";
import {Observable} from "rxjs";
import {LoginResponse} from "../../../types";
import {AnyCatcher} from "rxjs/internal/AnyCatcher";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private apiService: ApiService) {
  }

  loginUser = (url: string, body: any): Observable<AnyCatcher> => {
    return this.apiService.post(url, body);
  }
}
