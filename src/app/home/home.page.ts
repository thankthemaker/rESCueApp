import { Component } from '@angular/core';
import { BleClient, numberToUUID } from '@capacitor-community/bluetooth-le';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {
  }

  scan() {
    try {
      BleClient.initialize();
      BleClient.requestDevice();
    } catch (error) {
      console.error(error);
    }
  }
}
