import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {IonSlides} from '@ionic/angular';
import {BleService} from '../services/ble.service';
import {AppSettings} from '../models/AppSettings';
import {Device, DeviceInfo} from '@capacitor/device';
import {NotificationsService} from '../services/notification.service';
import {Storage} from '@capacitor/storage';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.page.html',
  styleUrls: ['./wizard.page.scss'],
})
export class WizardPage implements OnInit {

  @ViewChild('wizard', {static: false}) wizard: IonSlides;

  info: DeviceInfo;
  platform = 'unknown';
  connected: boolean;
  deviceId: string;
  deviceName: string;
  notificationsEnabled = false;
  slideOpts = {
    initialSlide: 1,
    speed: 400
  };
  batteryCells = 12;
  batteryGroups = 2;
  cellCapacity = 3000;
  noLightbar = false;
  vescId = 25;
  numberOfPixelLights = 32;
  numberOfPixelLightbar = 5;

  constructor(
    private router: Router,
    private bleService: BleService,
    public notificationService: NotificationsService) {
    this.connected = false;
    this.deviceName = '';
    this.deviceId = '';
  }

  async ngOnInit() {
    this.info = await Device.getInfo();
    this.platform = this.info.platform;
  }

  async scan() {
    const success = await this.bleService.connect(false);
    if (success) {
      this.deviceName = this.bleService.device.name;
      this.deviceId = this.bleService.device.deviceId;
      this.connected = true;
      this.wizard.slideNext(500);
    }
  }

  async skipWizard() {
    await Storage.set({key: 'deactivateWizard', value: String(true)});
    await this.router.navigate(['/home']);
  }

  async saveValue(key, value) {
    await this.bleService.write(
      AppSettings.RESCUE_SERVICE_UUID,
      AppSettings.RESCUE_CHARACTERISTIC_UUID_CONF,
      `${key}=${value}`);
  }

  async endWizard() {
    const minVoltage = (this.batteryCells * 3.3333).toFixed(1);
    const maxVoltage = (this.batteryCells * 4.2).toFixed(1);
    const lowVoltage = (this.batteryCells * 3.5).toFixed(1);
    await this.saveValue('vescId', this.vescId);
    await this.saveValue('numberPixelLight', this.numberOfPixelLights);
    await this.saveValue('numberPixelBatMon', this.numberOfPixelLightbar);
    await this.saveValue('minBatteryVoltage', minVoltage);
    await this.saveValue('lowBatteryVoltage', lowVoltage);
    await this.saveValue('maxBatteryVoltage', maxVoltage);
    await this.saveValue('save', 'true');
    await Storage.set({key: 'deactivateWizard', value: String(true)});
    await this.bleService.disconnect();
  }

  goBack() {
    this.wizard.slideTo(0, 500);
  }

  slideChanged() {
    if (!this.connected) {
      this.wizard.getActiveIndex().then((index) => {
        if (index > 1) {
          this.wizard.slideTo(1, 50);
        }
      });
    }
  }
}
