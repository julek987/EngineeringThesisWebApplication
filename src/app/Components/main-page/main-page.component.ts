import { Component } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {selectedComponent: string = 'analysis';

  switchComponent(component: string) {
    this.selectedComponent = component;
  }}
