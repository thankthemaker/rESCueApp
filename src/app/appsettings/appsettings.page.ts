import {Component, OnInit} from '@angular/core';
import {Storage} from '@capacitor/storage';
import {ToastController} from '@ionic/angular';
import {NGXLogger} from 'ngx-logger';
import {AppSettings} from '../models/AppSettings';

@Component({
  selector: 'app-appsettings',
  templateUrl: './appsettings.page.html',
  styleUrls: ['./appsettings.page.scss'],
})
export class AppsettingsPage implements OnInit {

  version: string;
  numberOfRides = 0;

  constructor(
    private toastController: ToastController,
    private logger: NGXLogger,
    public appSettings: AppSettings) {
}

  ngOnInit() {}

  async getSavedRides() {
    const rides = await Storage.keys();
    this.numberOfRides = rides.keys.length;
  }

  async deleteAppData() {
    const toast = await this.toastController.create({
      header: 'Remove all data!',
      message: 'Are you sure you want to delete all data?',
      color: 'danger',
      position: 'middle',
      buttons: [
        {
          //side: 'start',
          icon: 'trash-outline',
          text: 'Delete',
          handler: async () => {
            await Storage.clear();
            this.logger.info('Removed all data');
          }
        },
        {
          icon: 'close-circle',
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await toast.present();
  };
}
