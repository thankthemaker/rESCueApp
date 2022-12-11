import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InstallPage } from './install.page';

const routes: Routes = [
  {
    path: '',
    component: InstallPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstallPageRoutingModule {}
