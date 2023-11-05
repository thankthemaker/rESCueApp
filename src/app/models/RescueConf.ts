import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RescueConf {
  public deviceName: string = 'rESCue';
  public lowBatteryVoltage: number = 42.0;
  public minBatteryVoltage: number = 40.0;
  public maxBatteryVoltage: number = 50.4;
  public batteryDrift: number = 0;
  public startSoundIndex: number = 0;
  public startLightIndex: number = 1;
  public batteryWarningSoundIndex: number = 0;
  public batteryAlarmSoundIndex: number = 0;
  public startLightDuration: number = 1000;
  public idleLightIndex: number = 1;
  public idleLightTimeout: number = 60000;
  public lightFadingDuration: number = 50;
  public lightMaxBrightness: number = 100;
  public lightColorPrimary: number = 16777215;
  public lightColorSecondary: number = 16711680;
  public lightbarTurnOffErpm: number = 1000;
  public lightbarMaxBrightness: number = 100;
  public brakeLightEnabled: boolean = true;
  public brakeLightMinAmp: number = 4;
  public numberPixelLight: number = 16;
  public numberPixelBatMon: number = 5;
  public vescId: number  = 25;
  public authToken = '';
  public mtuSize: number = 512;
  public logLevel: number = 5;
  public realtimeDataInterval: number = 300;
  public balanceDataInterval: number = 300;
  public ledType: string = 'GRB';
  public ledFrequency: string = '800kHz';
  public lightBarLedType: string = "GRB";
  public lightBarLedFrequency: string = "800kHz";
  public isLightBarReversed: boolean = false;
  public isLightBarLedTypeDifferent: boolean = false;
  public mallGrab: boolean = false;
  public batteryType: string = '12s2p, 6Ah';
  public isNotificationEnabled: boolean = true;
  public isBatteryNotificationEnabled: boolean = true;
  public isCurrentNotificationEnabled: boolean = true;
  public isErpmNotificationEnabled: boolean = true;
  public oddevenActive: boolean = true;

  constructor() {}
}
