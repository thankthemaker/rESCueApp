import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {BleService} from '../services/ble.service';
import {environment} from '../../environments/environment';
import {NGXLogger} from 'ngx-logger';
import {StorageService} from '../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  version: string;
  footer: string;
  showVersionInfo = true;
  autoconnect = false;
  deactivateWizard = false;

  constructor(
    private router: Router,
    private bleService: BleService,
    private storageService: StorageService,
    private logger: NGXLogger) {
    this.version = environment.appVersion;
    this.footer = environment.footer;
    logger.info(`Application version is: version (from package.json)=${this.version}`);
  }

  async ionViewDidEnter() {
    this.deactivateWizard = await this.storageService.getBoolean('deactivateWizard');
    if(!this.deactivateWizard) {
      this.router.navigate(['/wizard']);
    }
    this.autoconnect = await this.storageService.getBoolean('autoconnect');
    if(this.autoconnect) {
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
    this.bleService.disconnect(true);
  }

  isConnected() {
    return this.bleService.connected;
  }

  toggleVersionInfo() {
    this.showVersionInfo = !this.showVersionInfo;
  }

  async startWizard() {
    await this.storageService.set('deactivateWizard', false);
    await this.router.navigate(['/wizard']);
  }
}
