import {Component, OnInit} from '@angular/core';
import {NGXLogger, NgxLoggerLevel} from 'ngx-logger';
import {environment} from '../environments/environment';
import {MenuController} from '@ionic/angular';
import {Router} from '@angular/router';
import {BleService} from './services/ble.service';
import {AppSettings} from './models/AppSettings';
import {Storage} from '@capacitor/storage';

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
    Storage.configure({'group': 'rESCueApp'});
    this.systemDark = window.matchMedia('(prefers-color-scheme: dark)');
    this.systemDark.addListener(this.colorTest);
    this.version = environment.appVersion;
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

  async colorTest(systemInitiatedDark) {
    const darkThemeSupported = await Storage.get({key: 'supportDarkTheme'});
    if (systemInitiatedDark.matches && darkThemeSupported.value === 'true') {
    } else {
    }
  }
}
