import {Component, OnInit} from '@angular/core';
import {BleService} from '../services/ble.service';

@Component({
  selector: 'app-incompatible',
  templateUrl: './incompatible.page.html',
  styleUrls: ['./incompatible.page.scss'],
})
export class IncompatiblePage implements OnInit {

  services: string[] = [];
  skipIncompatibleCheck = false;

  constructor(private bleService: BleService
  ) {
  }

  ngOnInit() {
    this.skipIncompatibleCheck = localStorage.getItem('skipIncompatibleCheck') === 'true';

    this.bleService.getServices().then(serviceIds => {
      this.services = serviceIds;
    });
  }

  toggleIncompatibleCheck(event) {
    const skipIncompatibleCheck = event.detail.checked;
    console.log('skipIncompatibleCheck is now ' + skipIncompatibleCheck);
    localStorage.setItem('skipIncompatibleCheck', skipIncompatibleCheck);
  }
}
