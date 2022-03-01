import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OdometerPage } from './odometer.page';

const routes: Routes = [
  {
    path: '',
    component: OdometerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OdometerPageRoutingModule {}
