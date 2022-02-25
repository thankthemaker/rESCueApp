import { Injectable } from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {Storage} from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class AppSettings {
  public static RESCUE_SERVICE_UUID = '99eb1511-a9e9-4024-b0a4-3dc4b4fabfb0';
  public static RESCUE_CHARACTERISTIC_UUID_CONF = '99eb1513-a9e9-4024-b0a4-3dc4b4fabfb0';
  public static RESCUE_CHARACTERISTIC_UUID_HW_VERSION = '99eb1515-a9e9-4024-b0a4-3dc4b4fabfb0';
  public static CHARACTERISTIC_UUID_FW = '99eb1514-a9e9-4024-b0a4-3dc4b4fabfb0';

  public static BLYNK_SERVICE_UUID = '713d0000-503e-4c75-ba94-3148f18d941e';

  public static VESC_SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
  public static VESC_CHARACTERISTICS_RX_UUID = '6e400002-b5a3-f393-e0a9-e50e24dcca9e';
  public static VESC_CHARACTERISTICS_TX_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

  public darkThemeSupported = true;
  public useVirtualDevice = false;
  public metricSystemEnabled = true;
  public notificationsEnabled = true;
  public batteryNotificationEnabled = true;
  public currentNotificationEnabled = true;
  public erpmNotificationEnabled = true;
  public dutycycleNotificationEnabled = true;
  public speedNotificationEnabled = true;
  public interval;
  public minVoltage;
  public lowVoltage;
  public maxVoltage;
  public maxCurrent;
  public maxErpm;
  public maxDuty;
  public maxSpeed;
  constructor(private logger: NGXLogger) {
    this.loadConfig().then();
  }

  public async toggleValue(property: string, event) {
    const value = event.detail.checked;
    this.logger.info(`${property} is now ${value}`);
    await Storage.set({key: property, value});
  }

  public async updateValue(property: string, value) {
    this.logger.info(`${property} is now ${value}`);
    await Storage.set({key: property, value});
  }

  private async loadConfig() {
    this.darkThemeSupported = (await Storage.get({key: 'darkThemeSupported'})).value === 'true';
    this.useVirtualDevice = (await Storage.get({key: 'useVirtualDevice'})).value === 'true';
    this.notificationsEnabled = (await Storage.get({key: 'notificationsEnabled'})).value === 'true';
    this.batteryNotificationEnabled = (await Storage.get({key: 'batteryNotificationEnabled'})).value === 'true';
    this.currentNotificationEnabled = (await Storage.get({key: 'currentNotificationEnabled'})).value === 'true';
    this.erpmNotificationEnabled = (await Storage.get({key: 'erpmNotificationEnabled'})).value === 'true';
    this.dutycycleNotificationEnabled = (await Storage.get({key: 'dutycycleNotificationEnabled'})).value === 'true';
    this.interval = Number((await Storage.get({key: 'notification.interval'})).value) || 5000;
    this.minVoltage = Number((await Storage.get({key: 'notification.minVoltage'})).value) || 40;
    this.lowVoltage = Number((await Storage.get({key: 'notification.lowVoltage'})).value) || 42;
    this.maxVoltage = Number((await Storage.get({key: 'notification.maxVoltage'})).value) || 50;
    this.maxCurrent = Number((await Storage.get({key: 'notification.maxCurrent'})).value) || 10;
    this.maxErpm = Number((await Storage.get({key: 'notification.maxErpm'})).value) || 45000;
    this.maxDuty = Number((await Storage.get({key: 'notification.maxDuty'})).value) || 80;
    this.maxSpeed = Number((await Storage.get({key: 'notification.maxSpeed'})).value) || 28;
  }
}
