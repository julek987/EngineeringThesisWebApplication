import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private apiService: ApiService, private authService: AuthService) { }

  loginUser(url: string, body: any): Observable<AnyCatcher> {
    return this.apiService.post(url, body).pipe(
      tap((response: any) => {
        if (response && response.role) {
          this.authService.setRole(response.role);
        }
      })
    );
  }
}
