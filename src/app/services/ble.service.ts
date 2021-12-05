import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {BleClient, BleDevice, numbersToDataView} from '@capacitor-community/bluetooth-le';
import {Device, DeviceInfo} from '@capacitor/device';
import {ToastController} from '@ionic/angular';
import {AppSettings} from '../AppSettings';

@Injectable({
  providedIn: 'root'
})
export class BleService {

  device: BleDevice;
  info: DeviceInfo;

  constructor(
    private router: Router,
    private toastCtrl: ToastController) {
  }

  async connect(autoconnect: boolean) {
    this.device = undefined;
    console.log('Connect with autoconnect: ' + autoconnect);
    try {
      this.info = await Device.getInfo();
      //this.info.isVirtual = true;
      if (this.info.isVirtual) {
        console.log('running on virtual device, faking BLE device');
        this.device = {
          deviceId: 'dmlydHVhbCByRVNDdWUK',
          name: 'virtual rESCue',
          uuids: [AppSettings.RESCUE_SERVICE_UUID, AppSettings.VESC_SERVICE_UUID]
        };
        return true;
      }
      await BleClient.initialize();

      //check if BLE is enabled on device, otherwise ask the user to turn on
      const isEnabled = await BleClient.getEnabled();
      console.log('Is BLE enabled: ' + isEnabled);

      if (autoconnect && localStorage.getItem('autoconnect') === 'true') {
        const savedDeviceId = localStorage.getItem('deviceId');
        console.log('Trying autoconnect for device: ' + savedDeviceId);
        const devices = await BleClient.getDevices([ savedDeviceId ]);
        console.log('Devices: ' + JSON.stringify(devices));
        if(devices.length === 1) {
          this.device = devices.pop();
        } else {
          console.log('Device not found ');
          this.presentWarningToast('Couldn\'t autoconnect to device ' + savedDeviceId);
          this.device = undefined;
        }
      }

      if(this.device === undefined) {
        this.device = await BleClient.requestDevice({
          services: [AppSettings.RESCUE_SERVICE_UUID, AppSettings.VESC_SERVICE_UUID],
          optionalServices: [AppSettings.RESCUE_SERVICE_UUID],
        });
      }
      await BleClient.connect(this.device.deviceId);

      console.log('connected to device ' + this.device.name + '(' + this.device.deviceId + ')');
      return true;
    } catch (error) {
      this.presentErrorToast(error);
      return false;
    }
  }

  async disconnect() {
    if (this.info.isVirtual) {
      return;
    }

    BleClient.disconnect(this.device.deviceId).then(() => {
      console.log('Disconnected from device ');
      this.router.navigate(['']);
    }).catch((error) => {
      console.error('Unable to disconnect ' + error);
    });
  }

  async checkServiceAvailable(serviceId): Promise<boolean> {
    const services = await BleClient.getServices(this.device.deviceId);
    return services.map(service => service.uuid).filter((uuid) => uuid === serviceId).length > 0;
  }

  async startNotifications(callback) {
    BleClient.startNotifications(
      this.device.deviceId,
      AppSettings.RESCUE_SERVICE_UUID,
      AppSettings.RESCUE_CHARACTERISTIC_UUID_CONF,
      callback
    );
  }

  async write(str: string) {
    if (this.info.isVirtual) {
      return;
    }

    const buf = new ArrayBuffer(str.length); // 2 bytes for each char
    const bufView = new Uint8Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    await BleClient.write(
      this.device.deviceId,
      AppSettings.RESCUE_SERVICE_UUID,
      AppSettings.RESCUE_CHARACTERISTIC_UUID_CONF,
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
            console.log('Close clicked');
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
            console.log('Close clicked');
          }
        }
      ]
    });
    await toast.present();
  }
}
