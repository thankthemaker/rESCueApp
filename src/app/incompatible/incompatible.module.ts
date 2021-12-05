import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncompatiblePageRoutingModule } from './incompatible-routing.module';

import { IncompatiblePage } from './incompatible.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncompatiblePageRoutingModule
  ],
  declarations: [IncompatiblePage]
})
export class IncompatiblePageModule {}
