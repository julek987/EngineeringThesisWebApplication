import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']  // Note the correct URL here
})
export class HeaderComponent {
  @Output() componentSelected = new EventEmitter<string>();
  activeComponent: string = 'analysis';  // Default to 'analysis'

  constructor(private router: Router) { }

  switchComponent(component: string) {
    this.activeComponent = component;
    this.componentSelected.emit(component);
  }

  logOutButtonClicked() {
    this.router.navigate(['']);
  }
}
