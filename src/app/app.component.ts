import {Component, OnInit} from '@angular/core';
import {NGXLogger, NgxLoggerLevel} from 'ngx-logger';
import {environment} from '../environments/environment';
import {MenuController} from '@ionic/angular';
import {Router} from '@angular/router';
import {BleService} from './services/ble.service';
import {AppSettings} from './models/AppSettings';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  version = '';
  systemDark: any;

  constructor(
    private router: Router,
    private menuController: MenuController,
    public bleService: BleService,
    private appSettings: AppSettings,
    private logger: NGXLogger) {
    this.version = environment.appVersion;
    if (environment.production) {
      logger.updateConfig({level: NgxLoggerLevel.OFF});
    }
  }

  ngOnInit() {
    this.systemDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.systemDark.addListener(this.colorTest);
    this.version = environment.appVersion;
    this.appSettings.darkThemeSupported = localStorage.getItem('darkThemeSupported') === 'true';
    this.appSettings.useVirtualDevice = localStorage.getItem('useVirtualDevice') === 'true';
    this.appSettings.notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';
    this.appSettings.batteryNotificationEnabled = localStorage.getItem('batteryNotificationEnabled') === 'true';
    this.appSettings.currentNotificationEnabled = localStorage.getItem('currentNotificationEnabled') === 'true';
    this.appSettings.erpmNotificationEnabled = localStorage.getItem('erpmNotificationEnabled') === 'true';
    this.appSettings.dutycycleNotificationEnabled = localStorage.getItem('dutycycleNotificationEnabled') === 'true';
  }

  selectMenu(url) {
    this.menuController.close();
    this.router.navigate([url]);
  }

  disconnect() {
    this.bleService.disconnect();
    this.menuController.close();
  }

  getDeviceName() {
    return this.bleService.device.name;
  }

  isConnected() {
    return this.bleService.connected;
  }

  colorTest(systemInitiatedDark) {
    const darkThemeSupported = localStorage.getItem('supportDarkTheme');
    if (systemInitiatedDark.matches && darkThemeSupported === 'true') {
    } else {
    }
  }
}
