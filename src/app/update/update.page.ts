import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingController, ToastController, PopoverController} from '@ionic/angular';
import _filter from 'lodash-es/filter';
import {FirmwareService} from '../services/firmware.service';
import {BleService} from '../services/ble.service';
import {AppSettings} from '../models/AppSettings';
import {ListpickerComponent} from '../components/listpicker/listpicker.component';
import {NGXLogger} from 'ngx-logger';

const characteristicSize = 512;

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  progress: string;
  progressNum: number;
  softwareVersion: string;
  hardwareVersion: string;
  deviceId: string;
  deviceName: string;
  updateData: any;
  dataToSend: any;
  checksum: string;
  totalSize: number;
  remaining: number;
  amountToWrite: number;
  currentPosition: number;
  loading: HTMLIonLoadingElement;
  downloadFinished = false;
  downloadFailed = false;
  updateInProgress = false;
  wifiEnabled = false;
  wifiSupported = false;
  disabled = false;
  isWifiConnected = false;
  lastSend = 0;
  lastAcknowledged = 0;
  lastSendTime: number;
  refreshIntervalId: any;
  resentCounter = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController,
    private popoverController: PopoverController,
    private loadingCtrl: LoadingController,
    private firmwareService: FirmwareService,
    private bleService: BleService,
    private logger: NGXLogger) {
    this.progress = 'starting update, please wait...';
    this.progressNum = 0;
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.deviceId = this.router.getCurrentNavigation().extras.state.deviceId;
        this.deviceName = this.router.getCurrentNavigation().extras.state.deviceName;
        this.softwareVersion = this.router.getCurrentNavigation().extras.state.softwareVersion;
        this.hardwareVersion = this.router.getCurrentNavigation().extras.state.hardwareVersion;
        //this.wifiSupported = this.router.getCurrentNavigation().extras.state.currentVersion >= 110;
        this.wifiSupported = bleService.info.platform !== 'web';
      }
    });
  }

  async ngOnInit() {
    try {
      this.loading = await this.loadingCtrl.create({
        message: 'Downloading firmware, please wait...'
      });

      await this.loading.present();

      await new Promise<void>((res, rej) => {
        this.firmwareService.getChecksum(this.softwareVersion).subscribe(result => {
          this.logger.debug(result + ', length: ' + result.length);
          const regex = '^[0-9a-z]{64}$';
          if (!result.slice(0, -1).match(regex)) {
            rej(new Error('No sha256sum found'));
          } else {
            this.downloadFailed = false;
            this.checksum = result;
            res();
          }
        }, error => {
          rej(error);
        });
      });

      await new Promise<void>((res, rej) => {
        this.firmwareService.getFirmwareFile(this.softwareVersion).subscribe(result => {
          this.totalSize = result.byteLength;
          this.downloadFinished = true;
          this.updateData = result;
          this.loading.dismiss();
          res();
        }, error => {
          rej(error);
        });
      });
    } catch(e) {
      this.logger.info(`FAILED: ${e.message}`);
      this.downloadFailed = true;
      this.loading.dismiss();
      const toast = await this.toastCtrl.create({
        header: 'Failed to retrieve firmware',
        message: e.message || 'Unknown error',
        position: 'bottom',
        color: 'danger',
        animated: true,
        duration: 3000,
      });
      await toast.present();
    }
  }

  async updateDevice() {
    if(this.bleService.info.isVirtual) {
      const toast = await this.toastCtrl.create({
        header: 'Virtual device detected.',
        message: 'Guess what? Update on virtual device not supported!',
        position: 'bottom',
        color: 'warning',
        animated: true,
        duration: 3000,
      });
      await toast.present();
      return;
    }
    this.updateInProgress = true;
    const byteCount = this.updateData.byteLength;
    this.logger.info('started update to version ' + this.softwareVersion);
    this.logger.info('filesize bytes ' + byteCount);
    this.sendFile();
  }

  async updateFinished(successful: boolean) {
    const toast = await this.toastCtrl.create({
      header: successful ? 'Update finished' : 'Update failed',
      message: 'Your update was ' + (successful ? 'successful, please restart your device.' : 'not successful.'),
      position: 'middle',
      color: successful ? 'success' : 'danger',
      animated: true,
      buttons: [{
        text: 'OK',
        role: 'ok'
      }]
    });
    await toast.present();
    const {role} = await toast.onDidDismiss();
    this.router.navigate(['']);
  }


  sendFile() {
    this.totalSize = this.updateData.byteLength;
    this.remaining = this.totalSize;
    this.amountToWrite = 0;
    this.currentPosition = 0;

    //this.refreshIntervalId = setInterval(this.uploadStateCheck.bind(this), 5000);

    if (!this.wifiEnabled) {
      this.bleService.startNotifications(
        AppSettings.RESCUE_SERVICE_UUID,
        AppSettings.CHARACTERISTIC_UUID_FW,
        value => {
          this.lastAcknowledged = value.getUint32(0);
          this.logger.debug('Got notification for: ' + this.lastAcknowledged);
          this.sendBufferedData.bind(this)(this.lastAcknowledged);
        });
    }
    this.sendBufferedData(-1);
  }

  async sendBufferedData(ack: number) {
    this.logger.debug('sendBufferedData: ' + this.lastSend++ + ', last ack. ' + ack);
    if (this.remaining > 0) {
      if (this.remaining >= characteristicSize) {
        this.amountToWrite = characteristicSize;
      } else {
        this.amountToWrite = this.remaining;
      }
      this.dataToSend = this.updateData.slice(this.currentPosition, this.currentPosition + this.amountToWrite);
      this.currentPosition += this.amountToWrite;
      this.remaining -= this.amountToWrite;
      this.logger.debug('remaining: ' + this.remaining);

      if (!this.wifiEnabled) {
        try {
          await this.bleService.writeDataView(
            AppSettings.RESCUE_SERVICE_UUID,
            AppSettings.CHARACTERISTIC_UUID_FW,
            new DataView(this.dataToSend));
        } catch (error) {
          console.error('Error BLE.write ' + error);
        }
      } else {
        this.firmwareService.postUpdateData(this.dataToSend).subscribe(result => {
          this.sendBufferedData.bind(this)(this.lastAcknowledged + 1);
        });
      }
      this.lastSendTime = new Date().getTime();

      this.progressNum = this.currentPosition / this.totalSize;
      this.progress = (100 * this.progressNum).toPrecision(3) + '%';
      if (this.progressNum >= 1) {
        this.bleService.disconnect();
        //clearInterval(this.refreshIntervalId);
        await this.updateFinished(true);
      }
    }
  }

  async uploadStateCheck() {
    const now = new Date().getTime();
    this.logger.debug('uploadStateCheck, now=' + now + ', last sent=' + this.lastSendTime);
    if (this.progressNum < 1 && now - this.lastSendTime > 3000) {
      this.resentCounter++;
      this.logger.debug('resend triggered, last ack. ' + this.lastAcknowledged + ', last send ' + this.lastSend);
      this.currentPosition -= this.amountToWrite;
      this.remaining += this.amountToWrite;
      this.lastSend--;
      this.sendBufferedData(this.lastAcknowledged + 1);
    }
  }

  toggle() {
    this.wifiEnabled = !this.wifiEnabled;
    this.disabled = this.wifiEnabled;
    const str = 'wifiActive=' + this.wifiEnabled;
    this.bleService.write(AppSettings.RESCUE_SERVICE_UUID,
      AppSettings.RESCUE_CHARACTERISTIC_UUID_CONF, str);
    const timer = setInterval(() => {
      this.firmwareService.checkWiFiConnection().subscribe(
        data => {
          this.logger.info('Wifi connection successful');
          this.isWifiConnected = true;
          this.disabled = false;
          clearInterval(timer);
        },
        error => this.logger.error(JSON.stringify(error)));
    }, 2000, 'check WiFi connection');
  }

  async loadVersions() {
    this.firmwareService.getVersioninfo().subscribe(result => {
      const versions = _filter(result.firmware, {hardware: [this.hardwareVersion]})
        .map(software => software.software)
        .splice(0, 6);
      this.logger.debug('Versions: ' + versions);
      this.showVersions(versions);
    });
  }

  async showVersions(versions) {
    const popover = await this.popoverController.create({
      component: ListpickerComponent,
      //cssClass: 'my-custom-class',
      componentProps: {
        title: 'Select rESCue version',
        items: versions
      },
      translucent: true
    });
    popover.present();

    const {data} = await popover.onDidDismiss();
    this.softwareVersion = data;
    this.logger.info('Selected version: ' + this.softwareVersion);
    this.ngOnInit();
  }
}
