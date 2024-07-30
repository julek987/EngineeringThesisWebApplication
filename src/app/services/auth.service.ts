import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private role: string | null = null;

  setRole(role: string) {
    this.role = role;
  }

  getRole(): string | null {
    return this.role;
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  isLoggedIn(): boolean {
    return this.role !== null;
  }

  logout() {
    this.role = null;
  }
}
