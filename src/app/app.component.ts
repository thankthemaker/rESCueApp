import {Component, OnInit} from '@angular/core';
import {NGXLogger, NgxLoggerLevel} from 'ngx-logger';
import {environment} from '../environments/environment';
import {MenuController} from '@ionic/angular';
import {Router} from '@angular/router';
import {BleService} from './services/ble.service';

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
    private bleService: BleService,
    private logger: NGXLogger) {
    this.version = environment.appVersion;
    if (environment.production) {
      logger.updateConfig({level: NgxLoggerLevel.OFF});
    }

  }

  ngOnInit() {
    console.log('app.component.ts onInit');
    this.systemDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.systemDark.addListener(this.colorTest);
  }

  selectMenu(url) {
    this.menuController.close();
    this.router.navigate([url]);
  }

  disconnect() {
    this.menuController.close();
    this.bleService.disconnect();
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
