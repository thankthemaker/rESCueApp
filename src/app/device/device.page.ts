import { Component, OnInit } from '@angular/core';
import { BleClient, BleDevice, numberToUUID } from '@capacitor-community/bluetooth-le';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss'],
})
export class DevicePage implements OnInit {

  device: BleDevice

  constructor(
      private route: ActivatedRoute, 
      private router: Router,
      private toastCtrl: ToastController) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.device = this.router.getCurrentNavigation().extras.state.device;
        console.log('UUIDs: ' + this.device.uuids)
      }
    });
  }

  ngOnInit() {
  }

  disconnect() {
    BleClient.disconnect(this.device.deviceId).then(() => {
      console.log('Disconnected from device ')
      this.router.navigate([''])   
    }).catch((error) => {
      console.error('Unable to disconnect ' + error)
    })
  }

  async checkForUpdate() {
      const toast = await this.toastCtrl.create({
        header: 'Update available',
        message: 'Do you want to update your rESCue device?',
        position: 'middle',
        color: 'warning',
        animated: true,
        buttons: [
          {
            //side: 'start',
            icon: 'checkmark-circle',
            text: 'Yes',
            handler: () => {
              console.log('Update clicked');
              this.router.navigate(['/update'])   
            }
          }, {
            icon: 'close-circle',
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      toast.present();
  }
}
