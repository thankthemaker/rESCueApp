import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BleService } from '../services/ble.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  version: string;
  showVersionInfo = true;

  constructor(
    private router: Router,
    private bleService: BleService) {
      this.version =environment.appVersion;
      console.log(`Application version is: version (from package.json)=${this.version}`);
    }

  async scan() {
      const success = await this.bleService.connect();
      if(success) {
        await this.router.navigate(['/device']);
      }
  }

  toggleVersionInfo() {
    this.showVersionInfo = ! this.showVersionInfo;
  }
}
