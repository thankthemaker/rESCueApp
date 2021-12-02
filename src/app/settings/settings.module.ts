import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingsPageRoutingModule } from './settings-routing.module';

import { SettingsPage } from './settings.page';
import {LightsComponent} from './lights/lights.component';
import {SoundsComponent} from "./sounds/sounds.component";
import {BatteryComponent} from "./battery/battery.component";
import {CanbusComponent} from "./canbus/canbus.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingsPageRoutingModule
  ],
  declarations: [SettingsPage, LightsComponent, SoundsComponent, BatteryComponent, CanbusComponent]
})
export class SettingsPageModule {}
