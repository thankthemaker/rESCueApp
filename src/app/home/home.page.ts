import { Component } from '@angular/core';
import { BleClient, BleDevice, numberToUUID } from '@capacitor-community/bluetooth-le';
import { ToastController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { AppSettings } from '../AppSettings';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private router: Router,
    private toastController: ToastController) {}

  async scan() {
    try {
      BleClient.initialize();
      
      //check if BLE is enabled on device, otherwise ask the user to turn on
      const isEnabled = await BleClient.getEnabled();
      console.log("Is BLE enabled: " + isEnabled)

      const device = await BleClient.requestDevice({
        services: [ AppSettings.ESP_SERVICE_UUID ],
        optionalServices: [AppSettings.OTA_SERVICE_UUID]
      })
      
      await BleClient.connect(device.deviceId);
     
      console.log('connected to device ' + device.name + '(' + atob(device.deviceId) + ')');
      let navigationExtras: NavigationExtras = {
        state: {
          device
        }
      };
      this.router.navigate(['/device'], navigationExtras)
    } catch(error) {
      this.presentToast(error);
    }
  } 
  

  async presentToast(error) {
    const toast = await this.toastController.create({
      header: "Bluetooth not supported",
      message: 'Your browser does not support BLE or it is not activated. (' + error + ')',
      animated: true,
      color: "danger",
      position: "middle",
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: () => {
            console.log('Close clicked');
          }
        }
      ]    });
    toast.present();
  }
}
