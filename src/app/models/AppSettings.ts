import { Injectable } from '@angular/core';
import {NGXLogger} from 'ngx-logger';

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

  constructor(private logger: NGXLogger) {
  }


  public toggleValue(property: string, event) {
    const value = event.detail.checked;
    this.logger.info(`${property} is now ${value}`);
    localStorage.setItem(property, value);
  }
}
