import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() componentSelected = new EventEmitter<string>();
  activeComponent: string = 'analysis';  // Default to 'analysis'

  constructor(private router: Router, private authService: AuthService) {}

  switchComponent(component: string) {
    this.activeComponent = component;
    this.componentSelected.emit(component);
  }

  logOutButtonClicked() {
    this.authService.setRole('user');  // Reset role to default
    this.router.navigate(['']);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}
