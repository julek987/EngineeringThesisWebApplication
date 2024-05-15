import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {selectedComponent: string = 'analysis';

  switchComponent(component: string) {
    this.selectedComponent = component;
  }}
