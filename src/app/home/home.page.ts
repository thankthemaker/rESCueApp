import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BleService} from '../services/ble.service';
import {environment} from '../../environments/environment';
import {NGXLogger} from "ngx-logger";

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
    this.deactivateWizard = Boolean(localStorage.getItem('deactivateWizard'));
    this.version = environment.appVersion;
    logger.info(`Application version is: version (from package.json)=${this.version}`);
  }

  ngOnInit() {
    if(!this.deactivateWizard) {
      this.router.navigate(['/wizard']);
    }
    if(localStorage.getItem('autoconnect') === 'true') {
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

  startWizard() {
    localStorage.setItem('deactivateWizard', String(false));
    this.router.navigate(['/wizard']);
  }
}
