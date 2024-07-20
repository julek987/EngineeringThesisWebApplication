import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainPageComponent} from "./Components/main-page/main-page.component";
import {LoginComponent} from "./Components/login/login.component";

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'main', component: MainPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
