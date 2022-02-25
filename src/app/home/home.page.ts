import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BleService} from '../services/ble.service';
import {environment} from '../../environments/environment';
import {NGXLogger} from 'ngx-logger';
import {Storage} from '@capacitor/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  version: string;
  showVersionInfo = true;
  autoconnect = false;
  deactivateWizard = false;

  constructor(
    private router: Router,
    private bleService: BleService,
    private logger: NGXLogger) {
    this.version = environment.appVersion;
    logger.info(`Application version is: version (from package.json)=${this.version}`);
  }

  async ngOnInit() {
    this.deactivateWizard = Boolean((await Storage.get({key: 'deactivateWizard'})).value === 'true');
    if(!this.deactivateWizard) {
      this.router.navigate(['/wizard']);
    }
    if((await Storage.get({key: 'autoconnect'})).value === 'true') {
      this.autoconnect = true;
      this.logger.info('Autoconnect detected, trying to connect device');
      this.connect(true);
    }
  }

  async connect(autoconnect: boolean) {
    const success = await this.bleService.connect(autoconnect);
    if (success) {
      await this.router.navigate(['/device']);
    }
  }

  disconnect() {
    this.bleService.disconnect();
  }

  isConnected() {
    return this.bleService.connected;
  }

  toggleVersionInfo() {
    this.showVersionInfo = !this.showVersionInfo;
  }

  async startWizard() {
    await Storage.set({key: 'deactivateWizard', value: String(false)});
    await this.router.navigate(['/wizard']);
  }
}
