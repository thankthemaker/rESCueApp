import { Component, Version } from '@angular/core';
import { Router } from '@angular/router';
import { BleService } from '../services/ble.service';
import { build } from "../../build";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  version : string
  timestamp : string

  constructor(
    private router: Router,
    private bleService: BleService) {
      this.version = build.version
      this.timestamp = build.timestamp
      console.log(`Application version is: version (from package.json)=${build.version}, timestamp=${build.timestamp}`);
    }

  async scan() {
      await this.bleService.connect();
      this.router.navigate(['/device'])
  } 
}
