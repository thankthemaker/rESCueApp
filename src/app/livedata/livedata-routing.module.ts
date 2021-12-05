import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LivedataPage } from './livedata.page';

const routes: Routes = [
  {
    path: '',
    component: LivedataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LivedataPageRoutingModule {}
