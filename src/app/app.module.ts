import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {provideHttpClient} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { AlertsComponent } from './alerts/alerts.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertsComponent
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
