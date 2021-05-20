import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BleService } from '../services/ble.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private router: Router,
    private bleService: BleService) {}

  async scan() {
      await this.bleService.connect();
      this.router.navigate(['/device'])
  } 
}
