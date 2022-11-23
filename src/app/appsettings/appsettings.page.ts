import {Component, OnInit} from '@angular/core';
import {ToastController} from '@ionic/angular';
import {NGXLogger} from 'ngx-logger';
import {AppSettings} from '../models/AppSettings';
import {environment} from '../../environments/environment';
import {StorageService} from '../services/storage.service';
import {KeysResult} from '@capacitor/preferences';

@Component({
  selector: 'app-appsettings',
  templateUrl: './appsettings.page.html',
  styleUrls: ['./appsettings.page.scss'],
})
export class AppsettingsPage implements OnInit {

  version: string;
  footer: string;
  numberOfRides = 0;
  usedSpace = 0;

  constructor(
    private toastController: ToastController,
    private logger: NGXLogger,
    private storageService: StorageService,
    public appSettings: AppSettings) {
    this.version = environment.appVersion;
    this.footer = environment.footer;
  }

  ngOnInit() {
    this.getSavedRides();
  }

  async getSavedRides() {
    const keys: KeysResult = await this.storageService.keys();
    const rides = keys.keys.filter((key) => key.startsWith('ride-'));
    this.numberOfRides = rides.length;
    this.usedSpace = this.numberOfRides;
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
            await this.storageService.clear();
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
