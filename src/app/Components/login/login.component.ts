import { Component } from '@angular/core';
import {LoginService} from "../../services/Login/login.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private loginService: LoginService, private router: Router) {

  }

  username: string = '';
  password: string = '';

  onLoginButtonClicked() {
    const body = {
      username: this.username,
      password: this.password
    };

    this.loginService.loginUser('http://localhost:5282/Auth/login', body)
      .subscribe({
        next: (response: { token: string }) => {
          const token = response.token;
          //Temporary saving in localStorage
          sessionStorage.setItem('authToken', token);
          console.log('Login successful, token received:');
          this.router.navigate(['/main']);
        },
        error: (error) => {
          console.error('Login failed:', error);
        }
      });
  }
}
