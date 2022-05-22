import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BleClient, BleDevice, numbersToDataView} from '@capacitor-community/bluetooth-le';
import {Device, DeviceInfo} from '@capacitor/device';
import {ToastController} from '@ionic/angular';
import {AppSettings} from '../models/AppSettings';
import {NGXLogger} from 'ngx-logger';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class BleService {

  isRescueDevice = true;
  connected = false;
  device: BleDevice;
  info: DeviceInfo;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private storageService: StorageService,
    private logger: NGXLogger) {
  }

  async connect(autoconnect: boolean) {
    this.device = undefined;
    this.logger.info('Connect with autoconnect: ' + autoconnect);
    try {
      this.info = await Device.getInfo();
      if(await this.storageService.getBoolean('useVirtualDevice')) {
        this.info.isVirtual = true;

      }
      if (this.info.isVirtual) {
        this.logger.warn('running on virtual device, faking BLE device');
        this.device = {
          deviceId: 'dmlydHVhbCByRVNDdWUK',
          name: 'virtual rESCue',
          uuids: [AppSettings.RESCUE_SERVICE_UUID, AppSettings.VESC_SERVICE_UUID]
        };
        this.connected = true;
        return true;
      }
      await BleClient.initialize();

      //check if BLE is enabled on device, otherwise ask the user to turn on
      const isEnabled = await BleClient.getEnabled();
      this.logger.debug('Is BLE enabled: ' + isEnabled);

      if (autoconnect && await this.storageService.getBoolean('autoconnect')) {
        const savedDeviceId = await this.storageService.get('deviceId');
        this.logger.info('Trying autoconnect for device: ' + savedDeviceId);
        const devices = await BleClient.getDevices([savedDeviceId]);
        this.logger.debug('Devices: ' + JSON.stringify(devices));
        if (devices.length === 1) {
          this.device = devices.pop();
        } else {
          this.logger.warn('Device not found ');
          this.presentWarningToast('Couldn\'t autoconnect to device ' + savedDeviceId);
          this.device = undefined;
        }
      }

      if (this.device === undefined) {
        this.device = await BleClient.requestDevice({
          services: [AppSettings.RESCUE_SERVICE_UUID, AppSettings.VESC_SERVICE_UUID],
          optionalServices: [AppSettings.RESCUE_SERVICE_UUID],
        });
      }
      await BleClient.connect(this.device.deviceId);

      this.logger.info('connected to device ' + this.device.name + '(' + this.device.deviceId + ')');
      this.connected = true;
      return true;
    } catch (error) {
      this.presentErrorToast(error);
      return false;
    }
  }

  async disconnect() {
    if (!this.info.isVirtual) {
      await BleClient.disconnect(this.device.deviceId);
      this.logger.info('Disconnected from device ');
    }
    this.connected = false;
    this.router.navigate(['']);
  }

  async checkServiceAvailable(serviceId): Promise<boolean> {
    if (this.info.isVirtual) {
      return true;
    }
    const services = await BleClient.getServices(this.device.deviceId);
    this.logger.debug('Available BLE-Services: ' + JSON.stringify(services));
    return services.map(service => service.uuid).filter((uuid) => uuid === serviceId).length > 0;
  }

  async getServices(): Promise<string[]> {
    const services = await BleClient.getServices(this.device.deviceId);
    this.logger.debug('Available BLE-Services: ' + JSON.stringify(services));
    return services.map(service => service.uuid);
  }

  async startNotifications(serviceId, characteristicId, callback) {
    if (this.info.isVirtual) {
      return;
    }
    BleClient.startNotifications(
      this.device.deviceId,
      serviceId,
      characteristicId,
      callback
    );
  }

  async writeDataView(serviceId, characteristicId, data: DataView) {
    if (this.info.isVirtual) {
      await new Promise(resolve => setTimeout(resolve, 50));
      return;
    }

    await BleClient.write(
      this.device.deviceId,
      serviceId,
      characteristicId,
      data
    );
  }

  async write(serviceId, characteristicId, str: string) {
    if (this.info.isVirtual) {
      await new Promise(resolve => setTimeout(resolve, 50));
      return;
    }

    const buf = new ArrayBuffer(str.length); // 2 bytes for each char
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    await BleClient.write(
      this.device.deviceId,
      serviceId,
      characteristicId,
      new DataView(buf)
    );
  }

  async readVersion() {
    if (this.info.isVirtual) {
      return numbersToDataView([3, 1, 1, 3, 0]);
    }

    return await BleClient.read(
      this.device.deviceId,
      AppSettings.RESCUE_SERVICE_UUID,
      AppSettings.RESCUE_CHARACTERISTIC_UUID_HW_VERSION,
    );
  }

  async presentWarningToast(warning) {
    const toast = await this.toastCtrl.create({
      header: 'Device not reachable',
      message: warning,
      animated: true,
      color: 'warning',
      position: 'top',
      duration: 3000,
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: () => {
            this.logger.debug('Close clicked');
          }
        }
      ]
    });
    await toast.present();
  }

  async presentErrorToast(error) {
    const toast = await this.toastCtrl.create({
      header: 'No BLE connection to rESCue device',
      message: 'Either your browser doesn\'t support BLE or it isn\'t activated or an error occured.\n' +
        'Details: ' + error,
      animated: true,
      color: 'danger',
      position: 'middle',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          handler: () => {
            this.logger.debug('Close clicked');
          }
        }
      ]
    });
    await toast.present();
  }
}
