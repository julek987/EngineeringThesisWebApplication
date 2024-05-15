import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() componentSelected = new EventEmitter<string>();

  switchComponent(component: string) {
    this.componentSelected.emit(component);
  }
}
