import {Component, OnInit} from '@angular/core';
import {BleService} from '../services/ble.service';
import {NGXLogger} from 'ngx-logger';
import {StorageService} from '../services/storage.service';

@Component({
  selector: 'app-incompatible',
  templateUrl: './incompatible.page.html',
  styleUrls: ['./incompatible.page.scss'],
})
export class IncompatiblePage implements OnInit {

  services: string[] = [];
  skipIncompatibleCheck = false;

  constructor(
    private bleService: BleService,
    private storageService: StorageService,
    private logger: NGXLogger) {
  }

  async ngOnInit() {
    this.skipIncompatibleCheck = await this.storageService.getBoolean('skipIncompatibleCheck');

    this.bleService.getServices().then(serviceIds => {
      this.services = serviceIds;
    });
  }

  async toggleIncompatibleCheck(value) {
    const skipIncompatibleCheck = value;
    this.logger.debug('skipIncompatibleCheck is now ' + skipIncompatibleCheck);
    await this.storageService.set('skipIncompatibleCheck', skipIncompatibleCheck);
  }
}
