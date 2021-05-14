import { Component } from '@angular/core';
import { BleClient, BleDevice, numberToUUID } from '@capacitor-community/bluetooth-le';
import { ToastController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
    private router: Router,
    private toastController: ToastController) {}

  scan() {
      BleClient.initialize();
      BleClient.requestDevice({
        //services: [ 'd804b643-6ce7-4e81-9f8a-ce0f699085eb', '713d0000-503e-4c75-ba94-3148f18d941e' ]
        //services: [ '6e400001-b5a3-f393-e0a9-e50e24dcca9e' ]
      }).then((device) => {
        console.log('connected to device ' + device.name + '(' + atob(device.deviceId) + ')');
        let navigationExtras: NavigationExtras = {
          state: {
            device
          }
        };
        this.router.navigate(['/device'], navigationExtras)
      }).catch(() => {
        this.presentToast();
      });
    } 
  

  async presentToast() {
    const toast = await this.toastController.create({
      header: "Bluetooth not supported",
      message: 'Your browser does not support BLE or it is not activated.',
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
