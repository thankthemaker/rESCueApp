import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RescueConf {
  public deviceName = 'rESCue';
  public lowBatteryVoltage = 42.0;
  public minBatteryVoltage = 40.0;
  public maxBatteryVoltage = 50.4;
  public batteryDrift = 0;
  public startSoundIndex = 0;
  public startLightIndex = 1;
  public batteryWarningSoundIndex = 0;
  public batteryAlarmSoundIndex = 0;
  public startLightDuration = 1000;
  public idleLightIndex = 1;
  public idleLightTimeout = 60000;
  public lightFadingDuration = 50;
  public lightMaxBrightness = 100;
  public lightColorPrimary = 16777215;
  public lightColorSecondary = 16711680;
  public brakeLightEnabled = false;
  public brakeLightMinAmp = 4;
  public numberPixelLight = 16;
  public numberPixelBatMon = 5;
  public vescId = 25;
  public authToken = '';
  public mtuSize = 512;
  public logLevel = 0;
  public realtimeDataInterval = 300;
  public balanceDataInterval = 300;
  public ledType = 'GRB';
  public ledFrequency = '800kHz';
  public batteryType = '12s2p, 6Ah';
  public isNotificationEnabled = true;
  public isBatteryNotificationEnabled = true;
  public isCurrentNotificationEnabled = true;
  public isErpmNotificationEnabled = true;

  constructor() {}
}
