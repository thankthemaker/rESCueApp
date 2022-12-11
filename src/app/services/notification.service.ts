import {Injectable} from '@angular/core';
import {Device} from '@capacitor/device';
import {ToastController} from '@ionic/angular';
import {NGXLogger} from 'ngx-logger';
import {AppSettings} from '../models/AppSettings';
import {StorageService} from './storage.service';
import {ActionPerformed, LocalNotifications, LocalNotificationSchema} from "@capacitor/local-notifications";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  id: number = 1;
  platform = 'unknown';

  constructor(
    private toastCtrl: ToastController,
    private storageService: StorageService,
    private appSettings: AppSettings,
    private logger: NGXLogger) {
    this.init();
  }

  async init() {
    const info = await Device.getInfo();
    this.platform = info.platform;
    LocalNotifications.addListener('localNotificationReceived', (notification: LocalNotificationSchema) => {
      this.logger.log(`Received: ${notification.id}`, `Custom Data: ${JSON.stringify(notification.extra)}`);
    });

    LocalNotifications.addListener('localNotificationActionPerformed', (notification: ActionPerformed) => {
      this.logger.log(`Performed: ${notification.actionId}`, `Input value:${notification.inputValue}`);
    });
  }

  async push(title: string, message: string) {
    if (await this.storageService.getBoolean('notificationsEnabled')) {
      if (this.platform !== 'ios') {
        const toast = await this.toastCtrl.create({
          header: title,
          message,
          position: 'bottom',
          color: 'warning',
          animated: true,
          duration: 3000,
        });
        await toast.present();
      }
      if (this.platform !== 'web') {
        LocalNotifications.schedule({
          notifications: [{
            id: this.id++,
            title,
            body: message
          }]
        });
      }
    }
  }

  async toggleNotifications() {
    if (this.platform !== 'web') {
      LocalNotifications.checkPermissions().then((hasPermissions) => {
        if (!hasPermissions) {
          LocalNotifications.requestPermissions().then((permissionsGranted) => {
            this.logger.info('permissions for push notifications granted');
          });
        }
      });
    }
    const notificationsEnabled = await this.storageService.getBoolean('notificationsEnabled');
    await this.updatePermissions(!notificationsEnabled);
  }

  async updatePermissions(permissionsGranted) {
    if (permissionsGranted) {
      this.appSettings.notificationsEnabled = true;
      this.appSettings.batteryNotificationEnabled = true;
      this.appSettings.currentNotificationEnabled = true;
      this.appSettings.erpmNotificationEnabled = true;
      this.appSettings.dutycycleNotificationEnabled = true;
      this.appSettings.speedNotificationEnabled = true;
      await this.storageService.set('notificationsEnabled', 'true');
      await this.storageService.set('batteryNotificationEnabled', 'true');
      await this.storageService.set('currentNotificationEnabled', 'true');
      await this.storageService.set('erpmNotificationEnabled', 'true');
      await this.storageService.set('dutycycleNotificationEnabled', 'true');
      await this.storageService.set('speedNotificationEnabled', 'true');
    } else {
      this.appSettings.notificationsEnabled = false;
      await this.storageService.set('notificationsEnabled', 'false');
    }
  }
}
