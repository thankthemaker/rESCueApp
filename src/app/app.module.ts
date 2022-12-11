import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { BleService } from './services/ble.service';
import {ListpickerComponent} from './components/listpicker/listpicker.component';
import {BatteryTypeComponent} from './settings/battery-type/battery-type.component';
import {LedTypeComponent} from './settings/led-type/led-type.component';
import {FormsModule} from '@angular/forms';
import { NgxColorsModule } from 'ngx-colors';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerModule } from 'ngx-logger';
import {NotificationsService} from './services/notification.service';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { environment } from '../environments/environment';

@NgModule({
    declarations: [AppComponent, ListpickerComponent, BatteryTypeComponent, LedTypeComponent],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        BrowserAnimationsModule,
        NgxColorsModule,
        LoggerModule.forRoot(environment.logger),
        FontAwesomeModule
    ],
    providers: [
        BleService,
        NotificationsService,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas, fab, far);
  }
}
