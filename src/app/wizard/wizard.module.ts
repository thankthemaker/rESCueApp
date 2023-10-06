import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WizardPageRoutingModule } from './wizard-routing.module';
import { WizardPage } from './wizard.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        WizardPageRoutingModule
    ],
  declarations: [WizardPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WizardPageModule {}
