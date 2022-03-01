import {Injectable} from '@angular/core';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {Device} from '@capacitor/device';
import {ToastController} from '@ionic/angular';
import {NGXLogger} from 'ngx-logger';
import {AppSettings} from "../models/AppSettings";
import {Storage} from "@capacitor/storage";
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  platform = 'unknown';

  constructor(
    private toastCtrl: ToastController,
    private localNotifications: LocalNotifications,
    private storageService: StorageService,
    private appSettings: AppSettings,
    private logger: NGXLogger) {
    this.init();
  }

  async init() {
    const info = await Device.getInfo();
    this.platform = info.platform;
  }

  async push(title: string, message: string) {
    if (await this.storageService.getBoolean('notificationsEnabled')) {
      if (this.platform === 'web') {
        const toast = await this.toastCtrl.create({
          header: title,
          message,
          position: 'bottom',
          color: 'warning',
          animated: true,
          duration: 3000,
        });
        await toast.present();
      } else {
        this.localNotifications.schedule({
          title,
          text: message,
          foreground: true
        });
      }
    }
  }

  async toggleNotifications() {
    if (this.platform !== 'web') {
      this.localNotifications.hasPermission().then((hasPermissions) => {
        if (!hasPermissions) {
          this.localNotifications.requestPermission().then((permissionsGranted) => {
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
