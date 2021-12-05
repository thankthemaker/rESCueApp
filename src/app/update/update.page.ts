import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BleClient} from '@capacitor-community/bluetooth-le';
import {LoadingController, ToastController, PopoverController} from '@ionic/angular';
import {VersionsComponent} from './versions/versions.component';
import _filter from 'lodash/filter';
import {FirmwareService} from '../services/firmware.service';
import {BleService} from '../services/ble.service';
import {AppSettings} from '../AppSettings';

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
  loading: any;
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
    private bleService: BleService) {
    this.progress = 'starting update, please wait...';
    this.progressNum = 0;
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.deviceId = this.router.getCurrentNavigation().extras.state.deviceId;
        this.softwareVersion = this.router.getCurrentNavigation().extras.state.softwareVersion;
        this.hardwareVersion = this.router.getCurrentNavigation().extras.state.hardwareVersion;
        //this.wifiSupported = this.router.getCurrentNavigation().extras.state.currentVersion >= 110;
        this.wifiSupported = true;
      }
    });
  }

  async ngOnInit() {
    this.loading = await this.loadingCtrl.create({
      message: 'Downloading firmware, please wait...'
    });

    await this.loading.present();

    this.firmwareService.getChecksum(this.softwareVersion).subscribe(result => {
      console.log(result + ', length: ' + result.length);
      const regex = '^[0-9a-z]{64}$';
      if(!result.slice(0, -1).match(regex)) {
        console.log('No sha256sum found');
        this.downloadFailed = true;
      } else {
        this.downloadFailed = false;
        this.checksum = result;
      }
    }, error => this.downloadFailed = true);

    this.firmwareService.getFirmwareFile(this.softwareVersion).subscribe(result => {
      this.totalSize = result.byteLength;
      this.downloadFinished = true;
      this.updateData = result;
      this.loading.dismiss();
    }, error => this.downloadFailed = true);
  }

  async updateDevice() {
    this.updateInProgress = true;
    const byteCount = this.updateData.byteLength;
    console.log('started update to version ' + this.softwareVersion);
    console.log('filesize bytes ' + byteCount);
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
      BleClient.startNotifications(
        this.deviceId,
        AppSettings.RESCUE_SERVICE_UUID,
        AppSettings.CHARACTERISTIC_UUID_FW,
        value => {
          this.lastAcknowledged = value.getUint32(0);
          console.log('Got notification for: ' + this.lastAcknowledged);
          this.sendBufferedData.bind(this)(this.lastAcknowledged);
        });
    }
    this.sendBufferedData(-1);
  }

  async sendBufferedData(ack: number) {
    console.log('sendBufferedData: ' + this.lastSend++ + ', last ack. ' + ack);
    if (this.remaining > 0) {
      if (this.remaining >= characteristicSize) {
        this.amountToWrite = characteristicSize;
      } else {
        this.amountToWrite = this.remaining;
      }
      this.dataToSend = this.updateData.slice(this.currentPosition, this.currentPosition + this.amountToWrite);
      this.currentPosition += this.amountToWrite;
      this.remaining -= this.amountToWrite;
      console.log('remaining: ' + this.remaining);

      if (!this.wifiEnabled) {
        try {
          await BleClient.write(
            this.deviceId,
            AppSettings.RESCUE_SERVICE_UUID,
            AppSettings.CHARACTERISTIC_UUID_FW,
            new DataView(this.dataToSend)
          );
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
        BleClient.disconnect(this.deviceId);
        //clearInterval(this.refreshIntervalId);
        await this.updateFinished(true);
      }
    }
  }

  async uploadStateCheck() {
    const now = new Date().getTime();
    console.log('uploadStateCheck, now=' + now + ', last sent=' + this.lastSendTime);
    if (this.progressNum < 1 && now - this.lastSendTime > 3000) {
      this.resentCounter++;
      console.log('resend triggered, last ack. ' + this.lastAcknowledged + ', last send ' + this.lastSend);
      this.currentPosition -= this.amountToWrite;
      this.remaining += this.amountToWrite;
      this.lastSend--;
      this.sendBufferedData(this.lastAcknowledged +1);
    }
  }

  toggle() {
    this.wifiEnabled = !this.wifiEnabled;
    this.disabled = this.wifiEnabled;
    const str = 'wifiActive=' + this.wifiEnabled;
    this.bleService.write(str);
    const timer = setInterval(() => {
      this.firmwareService.checkWiFiConnection().subscribe(
        data => {
          console.log('Wifi connection successful');
          this.isWifiConnected = true;
          this.disabled = false;
          clearInterval(timer);
        },
        error => console.log(JSON.stringify(error)));
    }, 2000, 'check WiFi connection');
  }

  async loadVersions() {
    this.firmwareService.getVersioninfo().subscribe(result => {
      const versions = _filter(result.firmware, {hardware: [this.hardwareVersion]}).map(software => software.software);
      console.log('Versions: ' + versions);
      this.showVersions(versions);
    });
  }

  async showVersions(versions) {
    const popover = await this.popoverController.create({
      component: VersionsComponent,
      //cssClass: 'my-custom-class',
      componentProps: {
        versions
      },
      translucent: true
    });
    popover.present();

    const {data} = await popover.onDidDismiss();
    this.softwareVersion = data;
    console.log('Selected version: ' + this.softwareVersion);
    this.ngOnInit();
  }
}
