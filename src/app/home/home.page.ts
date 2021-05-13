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
      BleClient.requestDevice({
        //services: [ 'd804b643-6ce7-4e81-9f8a-ce0f699085eb', '713d0000-503e-4c75-ba94-3148f18d941e' ]
        services: [ '6e400001-b5a3-f393-e0a9-e50e24dcca9e' ]
      }).then((device) => {
        console.log('connected to device ' + device.name + '(' + atob(device.deviceId) + ')');
      });
    } catch (error) {
      console.error(error);
    }
  }
}
