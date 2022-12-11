import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DevicePageRoutingModule } from './device-routing.module';
import { DevicePage } from './device.page';
import {ChartsModule} from '../charts/charts.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FontAwesomeModule,
        DevicePageRoutingModule,
        ChartsModule
    ],
  declarations: [DevicePage]
})
export class DevicePageModule {}
