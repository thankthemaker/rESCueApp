import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';
import {Storage} from '@capacitor/storage';
import {ToastController} from '@ionic/angular';
import {NGXLogger} from 'ngx-logger';

@Component({
  selector: 'app-appsettings',
  templateUrl: './appsettings.page.html',
  styleUrls: ['./appsettings.page.scss'],
})
export class AppsettingsPage implements OnInit {

  version: string;
  numberOfRides = 0;
  darkThemeSupport = true;

  constructor(
    private toastController: ToastController,
    private logger: NGXLogger) {
    this.darkThemeSupport = localStorage.getItem('supportDarkTheme') === 'true';
  }

  ngOnInit() {
    this.version = environment.appVersion;
  }

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

  toggleDarkThemeSupported(event) {
    const darkThemeSupported = event.detail.checked;
    this.logger.info('darkThemeSupported is now ' + darkThemeSupported);
    localStorage.setItem('supportDarkTheme', darkThemeSupported);
  }
}
