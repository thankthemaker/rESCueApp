import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BleService} from '../services/ble.service';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  version: string;
  showVersionInfo = true;
  autoconnect = false;
  connected = false;
  deactivateWizard = false;

  constructor(
    private router: Router,
    private bleService: BleService) {
    this.deactivateWizard = Boolean(localStorage.getItem('deactivateWizard'));
    this.version = environment.appVersion;
    console.log(`Application version is: version (from package.json)=${this.version}`);
  }

  ngOnInit() {
    if(!this.deactivateWizard) {
      this.router.navigate(['/wizard']);
    }
    if(localStorage.getItem('autoconnect') === 'true') {
      this.autoconnect = true;
      console.log('Autoconnect detected, trying to connect device');
      this.connect(true);
    }
  }

  async connect(autoconnect: boolean) {
    const success = await this.bleService.connect(autoconnect);
    if (success) {
      this.connected = true;
      await this.router.navigate(['/device']);
    }
  }

  disconnect() {
    this.bleService.disconnect();
    this.connected = false;
  }

  toggleVersionInfo() {
    this.showVersionInfo = !this.showVersionInfo;
  }

  startWizard() {
    localStorage.setItem('deactivateWizard', String(false));
    this.router.navigate(['/wizard']);
  }
}
