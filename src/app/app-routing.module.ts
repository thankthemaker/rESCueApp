import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'device',
    loadChildren: () => import('./device/device.module').then(m => m.DevicePageModule)
  },
  {
    path: 'update',
    loadChildren: () => import('./update/update.module').then(m => m.UpdatePageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'livedata',
    loadChildren: () => import('./livedata/livedata.module').then(m => m.LivedataPageModule)
  },
  {
    path: 'wizard',
    loadChildren: () => import('./wizard/wizard.module').then(m => m.WizardPageModule)
  },
  {
    path: 'incompatible',
    loadChildren: () => import('./incompatible/incompatible.module').then( m => m.IncompatiblePageModule)
  },
  {
    path: 'appsettings',
    loadChildren: () => import('./appsettings/appsettings.module').then( m => m.AppsettingsPageModule)
  },
  {
    path: 'appsettings/notifications',
    loadChildren: () => import('./appsettings/notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
