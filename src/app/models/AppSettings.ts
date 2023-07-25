import { Injectable } from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {StorageService} from '../services/storage.service';
import {ToastController} from '@ionic/angular';

const requiresReload = ['darkThemeSupported', 'metricSystemEnabled'];

@Injectable({
  providedIn: 'root'
})
export class AppSettings {
  public static KM_2_MILES = 0.621371;
  public static RESCUE_SERVICE_UUID = '99eb1511-a9e9-4024-b0a4-3dc4b4fabfb0';
  public static RESCUE_CHARACTERISTIC_UUID_CONF = '99eb1513-a9e9-4024-b0a4-3dc4b4fabfb0';
  public static RESCUE_CHARACTERISTIC_UUID_HW_VERSION = '99eb1515-a9e9-4024-b0a4-3dc4b4fabfb0';
  public static CHARACTERISTIC_UUID_FW = '99eb1514-a9e9-4024-b0a4-3dc4b4fabfb0';
  public static CHARACTERISTIC_UUID_LOOP = '99eb1516-a9e9-4024-b0a4-3dc4b4fabfb0';

  public static BLYNK_SERVICE_UUID = '713d0000-503e-4c75-ba94-3148f18d941e';

  public static VESC_SERVICE_UUID            = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
  public static VESC_CHARACTERISTICS_RX_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
  public static VESC_CHARACTERISTICS_TX_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

  public static OTA_SERVICE_UUID           = 'fe590001-54ae-4a28-9f74-dfccb248601d';
  public static OTA_CHARACTERISTIC_RX_UUID = 'fe590002-54ae-4a28-9f74-dfccb248601d';
  public static OTA_CHARACTERISTIC_TX_UUID = 'fe590003-54ae-4a28-9f74-dfccb248601d';


  public darkThemeSupported = true;
  public metricSystemEnabled = true;
  public useVirtualDevice = false;
  public useOdometer = false;
  public notificationsEnabled = false;
  public batteryNotificationEnabled = false;
  public currentNotificationEnabled = false;
  public erpmNotificationEnabled = false;
  public dutycycleNotificationEnabled = false;
  public speedNotificationEnabled = false;
  public interval;
  public minVoltage;
  public lowVoltage;
  public maxVoltage;
  public maxCurrent;
  public maxErpm;
  public maxDuty;
  public maxSpeed;

  constructor(
    private toastController: ToastController,
    private storageService: StorageService,
    private logger: NGXLogger
  ) {
    this.loadConfig().then();
  }

  public async toggleValue(property: string, value) {
    if(value === await this.storageService.getBoolean(property)) {
      return; // no change detected, abort
    }
    this.logger.info(`${property} is now ${value}`);
    await this.storageService.set(property, value);
    if (requiresReload.includes(property)) {
      const toast = await this.toastController.create({
        header: 'App restart required!',
        message: 'For your changes to take effect, please restart your rESCueApp.',
        color: 'primary',
        position: 'middle',
        buttons: [
          {
            icon: 'close-circle',
            text: 'Close',
            role: 'cancel'
          }
        ]
      });
      await toast.present();
    }
  }

  public async updateValue(property: string, value) {
    this.logger.info(`${property} is now ${value}`);
    await this.storageService.set(property, value);
  }

  private async loadConfig() {
    this.darkThemeSupported = await this.storageService.getBoolean('darkThemeSupported');
    this.metricSystemEnabled = await this.storageService.getBoolean('metricSystemEnabled');
    this.useVirtualDevice = await this.storageService.getBoolean('useVirtualDevice');
    this.useOdometer = await this.storageService.getBoolean('useOdometer');
    this.notificationsEnabled = await this.storageService.getBoolean('notificationsEnabled');
    this.batteryNotificationEnabled = await this.storageService.getBoolean('batteryNotificationEnabled');
    this.currentNotificationEnabled = await this.storageService.getBoolean('currentNotificationEnabled');
    this.erpmNotificationEnabled = await this.storageService.getBoolean('erpmNotificationEnabled');
    this.dutycycleNotificationEnabled = await this.storageService.getBoolean('dutycycleNotificationEnabled');
    this.speedNotificationEnabled = await this.storageService.getBoolean('speedNotificationEnabled');
    this.interval = Number((await this.storageService.get('notification.interval'))) || 5000;
    this.minVoltage = Number((await this.storageService.get('notification.minVoltage'))) || 40;
    this.lowVoltage = Number((await this.storageService.get('notification.lowVoltage'))) || 42;
    this.maxVoltage = Number((await this.storageService.get('notification.maxVoltage'))) || 50.4;
    this.maxCurrent = Number((await this.storageService.get('notification.maxCurrent'))) || 10;
    this.maxErpm = Number((await this.storageService.get('notification.maxErpm'))) || 45000;
    this.maxDuty = Number((await this.storageService.get('notification.maxDuty'))) || 80;
    this.maxSpeed = Number((await this.storageService.get('notification.maxSpeed'))) || 28;
  }
}
