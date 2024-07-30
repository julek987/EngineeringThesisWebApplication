import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainPageComponent} from "./Components/main-page/main-page.component";
import {LoginComponent} from "./Components/login/login.component";
import {DetailComponent} from "./Components/detail/detail.component";
import {AdminGuard} from "./admin-guard";
import {AdminPanelComponent} from "./Components/admin-panel/admin-panel.component";
import {AuthGuard} from "./auth-guard";

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'main', component: MainPageComponent, canActivate: [AuthGuard]  },
  { path: 'details', component: DetailComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminPanelComponent, canActivate: [AdminGuard, AuthGuard] },
  { path: '**', redirectTo: 'logged-out' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
