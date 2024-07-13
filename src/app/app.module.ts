import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {provideHttpClient} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { AlertsComponent } from './Components/alerts/alerts.component';
import { HeaderComponent } from './Components/header/header.component';
import { AnalysisComponent } from './Components/analysis/analysis.component';
import { BestsellersComponent } from './Components/bestsellers/bestsellers.component';
import { ClientListComponent } from './Components/client-list/client-list.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertsComponent,
    HeaderComponent,
    AnalysisComponent,
    BestsellersComponent,
    ClientListComponent
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
