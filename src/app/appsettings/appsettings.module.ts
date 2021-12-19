import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AppsettingsPageRoutingModule } from './appsettings-routing.module';

import { AppsettingsPage } from './appsettings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AppsettingsPageRoutingModule
  ],
  declarations: [AppsettingsPage]
})
export class AppsettingsPageModule {}
