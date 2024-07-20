import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { AlertsComponent } from './Components/alerts/alerts.component';
import { HeaderComponent } from './Components/header/header.component';
import { AnalysisComponent } from './Components/analysis/analysis.component';
import { BestsellersComponent } from './Components/bestsellers/bestsellers.component';
import { ClientListComponent } from './Components/client-list/client-list.component';
import { LoginComponent } from './Components/login/login.component';
import { MainPageComponent } from './Components/main-page/main-page.component';
import { AuthInterceptor } from './services/auth-interceptor.interceptor'
import {LoginService} from "./services/Login/login.service";
import { AdminPanelComponent } from './Components/admin-panel/admin-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertsComponent,
    HeaderComponent,
    AnalysisComponent,
    BestsellersComponent,
    ClientListComponent,
    LoginComponent,
    MainPageComponent,
    AdminPanelComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule
    ],
  providers: [provideHttpClient(),
    LoginService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
