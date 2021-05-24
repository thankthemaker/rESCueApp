import { Component, Version } from '@angular/core';
import { Router } from '@angular/router';
import { BleService } from '../services/ble.service';
import { VERSION } from '../../environments/version';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  version : string
  tag : string
  hash : string

  constructor(
    private router: Router,
    private bleService: BleService) {
      this.version = VERSION.version
      this.tag = VERSION.tag
      this.hash = VERSION.hash
      console.log(`Application version is: version (from package.json)=${VERSION.version}, git-tag=${VERSION.tag}, git-hash=${VERSION.hash}`);
    }

  async scan() {
      await this.bleService.connect();
      this.router.navigate(['/device'])
  } 
}
