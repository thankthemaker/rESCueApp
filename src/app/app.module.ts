import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { BleService } from './services/ble.service';
import {VersionsComponent} from './update/versions/versions.component';
import {BatteryTypeComponent} from './settings/battery-type/battery-type.component';
import {LedTypeComponent} from './settings/led-type/led-type.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [AppComponent, VersionsComponent, BatteryTypeComponent, LedTypeComponent ],
  entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, FormsModule],
  providers: [BleService, { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
