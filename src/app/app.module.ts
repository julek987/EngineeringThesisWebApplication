import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {provideHttpClient} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { AlertsComponent } from './alerts/alerts.component';
import { HeaderComponent } from './header/header.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { BestsellersComponent } from './bestsellers/bestsellers.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertsComponent,
    HeaderComponent,
    AnalysisComponent,
    BestsellersComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule
    ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
