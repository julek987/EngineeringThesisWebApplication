import {Component, EventEmitter, Output} from '@angular/core';
import {setThrowInvalidWriteToSignalError} from "@angular/core/primitives/signals";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() componentSelected = new EventEmitter<string>();

  constructor(private router: Router) {

  }

  switchComponent(component: string) {
    this.componentSelected.emit(component);
  }

  logOutButtonClicked(){
    sessionStorage.clear();
    this.router.navigate(['']);
  }
  protected readonly setThrowInvalidWriteToSignalError = setThrowInvalidWriteToSignalError;
}
