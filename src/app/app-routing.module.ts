import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainPageComponent} from "./Components/main-page/main-page.component";
import {LoginComponent} from "./Components/login/login.component";
import {DetailComponent} from "./Components/detail/detail.component";
import {AdminGuard} from "./admin-guard";
import {AdminPanelComponent} from "./Components/admin-panel/admin-panel.component";

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'main', component: MainPageComponent },
  { path: 'details', component: DetailComponent },
  { path: 'admin', component: AdminPanelComponent, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
