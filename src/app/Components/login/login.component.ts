import { Component } from '@angular/core';
import { LoginService } from '../../services/Login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']  // Note the correct URL here
})
export class LoginComponent {

  constructor(private loginService: LoginService, private router: Router) { }

  username: string = '';
  password: string = '';

  onLoginButtonClicked() {
    const body = {
      username: this.username,
      password: this.password
    };

    this.loginService.loginUser('http://localhost:5282/Auth/login', body)
      .subscribe({
        next: (response: any) => {
          console.log('Login successful, response:', response);
          this.router.navigate(['/main']);
        },
        error: (error) => {
          console.error('Login failed:', error);
        }
      });
  }
}
