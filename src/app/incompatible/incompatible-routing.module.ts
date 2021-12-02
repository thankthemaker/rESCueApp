import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncompatiblePage } from './incompatible.page';

const routes: Routes = [
  {
    path: '',
    component: IncompatiblePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncompatiblePageRoutingModule {}
