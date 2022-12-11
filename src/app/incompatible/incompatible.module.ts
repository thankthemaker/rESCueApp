import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncompatiblePageRoutingModule } from './incompatible-routing.module';

import { IncompatiblePage } from './incompatible.page';
import {AccordionComponent} from '../components/accordion/accordion.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncompatiblePageRoutingModule
  ],
    declarations: [IncompatiblePage, AccordionComponent]
})
export class IncompatiblePageModule {}
