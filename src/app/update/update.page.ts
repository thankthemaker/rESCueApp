import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LoadingController, ToastController, PopoverController} from '@ionic/angular';
import _filter from 'lodash-es/filter';
import {FirmwareService} from '../services/firmware.service';
import {BleService} from '../services/ble.service';
import {AppSettings} from '../models/AppSettings';
import {ListpickerComponent} from '../components/listpicker/listpicker.component';
import {NGXLogger} from 'ngx-logger';


import {BleClient, BleDevice, numbersToDataView} from '@capacitor-community/bluetooth-le';

const part = 19000;
const mtu = 250;
const characteristicSize = mtu - 3;

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
  partCount: number;
  loading: HTMLIonLoadingElement;
  downloadFinished = false;
  downloadFailed = false;
  updateInProgress = false;
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
      }
    });
  }

  async ngOnInit() {

    this.softwareVersion = "v2.3.3"

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

    this.bleService.write(AppSettings.RESCUE_SERVICE_UUID,
      AppSettings.RESCUE_CHARACTERISTIC_UUID_CONF,"update=start");

    await this.bleService.connect(false);

      const timer = setInterval(() => {
        console.log("Starting update now")
           this.sendFile();
          clearInterval(timer);
        }, 5000, 'startUpdate');

  }

  async updateFinished(successful: boolean) {

      const timer = setInterval(() => {
        console.log("Finishing update now")
        this.bleService.write(AppSettings.RESCUE_SERVICE_UUID,
          AppSettings.RESCUE_CHARACTERISTIC_UUID_CONF,"update=stop");         
           clearInterval(timer);
        }, 10000, 'finishUpdate');

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


  async sendFile() {
    this.totalSize = this.updateData.byteLength;
    this.remaining = this.totalSize;
    this.amountToWrite = 0;
    this.currentPosition = 0;
    this.partCount = this.totalSize / part;

    //this.refreshIntervalId = setInterval(this.uploadStateCheck.bind(this), 5000);

    /*
       this.bleService.startNotifications(
        AppSettings.OTA_SERVICE_UUID,
        AppSettings.OTA_CHARACTERISTIC_TX_UUID,
        (value) => {
          this.logger.info('onNotification: ' + JSON.stringify(value));
          this.handleNotification(value);
        });
 */
        BleClient.startNotifications(
          this.bleService.device.deviceId,
          AppSettings.OTA_SERVICE_UUID,
          AppSettings.OTA_CHARACTERISTIC_TX_UUID,
          (value) => {
            this.logger.info('onNotification: ' + JSON.stringify(value));
            this.handleNotification(value);
          }
        );

        try {
          await this.bleService.writeDataView(
            AppSettings.OTA_SERVICE_UUID,
            AppSettings.OTA_CHARACTERISTIC_RX_UUID,
            new DataView(Buffer.from([
              0xFE,
              this.totalSize >> 24 & 0xFF,
              this.totalSize >> 16 & 0xFF,
              this.totalSize >> 8 & 0xFF,
              this.totalSize & 0xFF
            ]).buffer));
        } catch (error) {
          console.error('Error BLE.write ' + error);
        }

        try {
          await this.bleService.writeDataView(
            AppSettings.OTA_SERVICE_UUID,
            AppSettings.OTA_CHARACTERISTIC_RX_UUID,
            new DataView(Buffer.from([
              0xFF,
              this.partCount / 256, 
              this.partCount % 256, 
              mtu / 256, 
              mtu % 256          
            ]).buffer));
        } catch (error) {
          console.error('Error BLE.write ' + error);
        }

        try {
          await this.bleService.writeDataView(
            AppSettings.OTA_SERVICE_UUID,
            AppSettings.OTA_CHARACTERISTIC_RX_UUID,
            new DataView(Buffer.from([0xFD]).buffer));
        } catch (error) {
          console.error('Error BLE.write ' + error);
        }

        //        this.sendBufferedData(-1);
}


  async handleNotification(value) {
    this.logger.info('handleNotification: ' + JSON.stringify(value));
    this.logger.info('value.length: ' + value.length);

    if(!value || !value.length || value.length == 0) {
      this.logger.info('no data skipping');
      return
    }

    this.lastAcknowledged = value.getUint32(0);
    this.logger.info('handleNotification: ' + this.lastAcknowledged);

    switch(value.getUint32(0)) {
      case 0xAA:
        this.logger.info('Start transfer');
        this.sendBufferedData.bind(this)(this.lastAcknowledged);
        break
      case 0xF1:
        this.logger.info('Sending package');
        this.sendBufferedData.bind(this)(this.lastAcknowledged);
        value.getUint32
        break
      case 0xF2:
        this.logger.info('Starting firmware install');
        break
      case 0x0F:
        this.logger.info('Finished update with result');
        break
    }
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

        try {
          await this.bleService.writeDataView(
            AppSettings.OTA_SERVICE_UUID,
            AppSettings.OTA_CHARACTERISTIC_RX_UUID,
            new DataView(this.dataToSend));
        } catch (error) {
          console.error('Error BLE.write ' + error);
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
