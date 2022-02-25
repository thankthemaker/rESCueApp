import {Component, OnInit} from '@angular/core';
import {BleService} from '../services/ble.service';
import {NGXLogger} from 'ngx-logger';
import {Storage} from '@capacitor/storage';

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
    private logger: NGXLogger) {
  }

  async ngOnInit() {
    this.skipIncompatibleCheck = (await Storage.get({key: 'skipIncompatibleCheck'})).value === 'true';

    this.bleService.getServices().then(serviceIds => {
      this.services = serviceIds;
    });
  }

  async toggleIncompatibleCheck(event) {
    const skipIncompatibleCheck = event.detail.checked;
    this.logger.debug('skipIncompatibleCheck is now ' + skipIncompatibleCheck);
    await Storage.set({key: 'skipIncompatibleCheck', value: skipIncompatibleCheck});
  }
}
