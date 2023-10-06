import {Component, ViewChild, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {IonicSlides} from '@ionic/angular';
import {BleService} from '../services/ble.service';
import {AppSettings} from '../models/AppSettings';
import {Device, DeviceInfo} from '@capacitor/device';
import {NotificationsService} from '../services/notification.service';
import {StorageService} from '../services/storage.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.page.html',
  styleUrls: ['./wizard.page.scss'],
})
export class WizardPage {

  @ViewChild('wizard')
  swiperRef: ElementRef | undefined;

  swiperModules = [IonicSlides];

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
    private storageService: StorageService,
    private appSettings: AppSettings,
    public notificationService: NotificationsService) {
    this.connected = false;
    this.deviceName = '';
    this.deviceId = '';
  }

  async ionViewDidEnter() {
    this.info = await Device.getInfo();
    this.platform = this.info.platform;
  }

  async scan() {
    const success = await this.bleService.connect(false);
    if (success) {
      this.deviceName = this.bleService.device.name;
      this.deviceId = this.bleService.device.deviceId;
      this.connected = true;
      this.swiperRef.nativeElement.swiper.slideNext(500);
    }
  }

  async skipWizard() {
    await this.storageService.set('deactivateWizard', true);
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
    await this.storageService.set('notification.minVoltage', minVoltage);
    await this.storageService.set('notification.lowVoltage', lowVoltage);
    await this.storageService.set('notification.maxVoltage', maxVoltage);
    await this.storageService.set('battery.cells', this.batteryCells);
    await this.storageService.set('battery.groups', this.batteryGroups);
    await this.storageService.set('battery.cellcapacity', this.cellCapacity);
    await this.storageService.set('deactivateWizard', 'true');
    this.appSettings.minVoltage = minVoltage;
    this.appSettings.lowVoltage = lowVoltage;
    this.appSettings.maxVoltage = maxVoltage;
    await this.bleService.disconnect(true);
  }

  goBack() {
    this.swiperRef.nativeElement.swiper.slidePrev();
  }

  slideChanged(e: any) {
    if (!this.connected && this.swiperRef.nativeElement.swiper.activeIndex > 1) {
      this.swiperRef.nativeElement.swiper.slideTo(1, 50);
    }
  }
}