import {Injectable} from '@angular/core';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {Device} from '@capacitor/device';
import {ToastController} from '@ionic/angular';
import {NGXLogger} from 'ngx-logger';
import {AppSettings} from "../models/AppSettings";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  platform = 'unknown';

  constructor(
    private toastCtrl: ToastController,
    private localNotifications: LocalNotifications,
    private appSettings: AppSettings,
    private logger: NGXLogger) {
    this.init();
  }

  async init() {
    const info = await Device.getInfo();
    this.platform = info.platform;
  }

  async push(title: string, message: string) {
    if (localStorage.getItem('notificationsEnabled') === 'true') {
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

  toggleNotifications() {
    if (this.platform !== 'web') {
      this.localNotifications.hasPermission().then((hasPermissions) => {
        if (!hasPermissions) {
          this.localNotifications.requestPermission().then((permissionsGranted) => {
            this.logger.info('permissions for push notifications granted');
          });
        }
      });
    }
    const notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true';
    this.updatePermissions(!notificationsEnabled);

  }

  updatePermissions(permissionsGranted) {
    if (permissionsGranted) {
      this.appSettings.notificationsEnabled = true;
      this.appSettings.batteryNotificationEnabled = true;
      this.appSettings.currentNotificationEnabled = true;
      this.appSettings.erpmNotificationEnabled = true;
      this.appSettings.dutycycleNotificationEnabled = true;
      localStorage.setItem('notificationsEnabled', 'true');
      localStorage.setItem('batteryNotificationEnabled', 'true');
      localStorage.setItem('currentNotificationEnabled', 'true');
      localStorage.setItem('erpmNotificationEnabled', 'true');
      localStorage.setItem('dutycycleNotificationEnabled', 'true');
    } else {
      this.appSettings.notificationsEnabled = false;
      localStorage.setItem('notificationsEnabled', 'false');
    }
  }
}
