import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppsettingsPage } from './appsettings.page';

const routes: Routes = [
  {
    path: '',
    component: AppsettingsPage
  },
  {
    path: 'notifications',
    loadChildren: () => import('./notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'odometer',
    loadChildren: () => import('./odometer/odometer.module').then( m => m.OdometerPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppsettingsPageRoutingModule {}
