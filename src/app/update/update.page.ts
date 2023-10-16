import { Component, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController, PopoverController } from '@ionic/angular';
import _filter from 'lodash-es/filter';
import { FirmwareService } from '../services/firmware.service';
import { BleService } from '../services/ble.service';
import { AppSettings } from '../models/AppSettings';
import { ListpickerComponent } from '../components/listpicker/listpicker.component';
import { NGXLogger } from 'ngx-logger';
import * as CryptoJS from 'crypto-js';

const part = 19000;
const mtu = 250;

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage {

  progressbarType = 'indeterminate';
  progress: string;
  progressNum=0.0;
  softwareVersion: string;
  softwareType: string;
  hardwareVersion: string;
  deviceId: string;
  deviceName: string;
  deviceString: string;
  firmwareString = '';
  updateData: any;
  dataToSend: any;
  checksum: string;
  totalSize: number;
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
  resentCounter = 0;
  firmwareFile: File;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController,
    private popoverController: PopoverController,
    private loadingCtrl: LoadingController,
    private firmwareService: FirmwareService,
    private bleService: BleService,
    public appSettings: AppSettings, // needed in html template
    private logger: NGXLogger,
    private _zone: NgZone) {
    this.progress = 'starting update, please wait...';
    this.progressNum = 0;
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.deviceId = this.router.getCurrentNavigation().extras.state.deviceId;
        this.deviceName = this.router.getCurrentNavigation().extras.state.deviceName;
        this.deviceString = this.router.getCurrentNavigation().extras.state.deviceString;
        this.softwareVersion = this.router.getCurrentNavigation().extras.state.softwareVersion;
        this.hardwareVersion = this.router.getCurrentNavigation().extras.state.hardwareVersion;
        this.firmwareString = this.softwareVersion;
      }
  });
}

onFirmwareFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files.length > 0) {
    this.firmwareFile = input.files[0];
    this.ionViewDidEnter();
  }
}

  async ionViewDidEnter() {
    try {
      this.loading = await this.loadingCtrl.create({
        message: 'Downloading firmware, please wait...'
      });
  
      await this.loading.present();
  
      // Check if the software version selected is a local file.
      if (this.softwareVersion === "Local File") {
        if (!this.firmwareFile) {
          throw new Error('No local file selected.');
        }
        
        const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as ArrayBuffer);
          reader.onerror = () => reject(new Error('Failed to read local file.'));
          reader.readAsArrayBuffer(this.firmwareFile);
        });
  
        this.totalSize = arrayBuffer.byteLength;
        this.updateData = arrayBuffer;
        const wordArray = CryptoJS.lib.WordArray.create(arrayBuffer);
        this.checksum = CryptoJS.SHA256(wordArray).toString();
        this.downloadFinished = true;
        this.downloadFailed = false;
        this.loading.dismiss();
      } else {
        // Existing logic to fetch firmware and calculate checksum from the service.
      await new Promise<void>((res, rej) => {
        const filename = "" + this.softwareVersion;
        this.firmwareService.getChecksum(this.deviceString, filename).subscribe(result => {
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
        this.firmwareService.getFirmwareFile(this.deviceString, this.softwareVersion).subscribe(result => {
          this.totalSize = result.byteLength;
          this.downloadFinished = true;
          this.updateData = result;
          this.loading.dismiss();
          res();
        }, error => {
          rej(error);
        });
      });     
    } 
    } catch (e) {
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
    if (this.bleService.info.isVirtual) {
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

    await this.bleService.write(AppSettings.RESCUE_SERVICE_UUID,
      AppSettings.RESCUE_CHARACTERISTIC_UUID_CONF, "update=start");

    await this.bleService.disconnect(false);

    await this.bleService.connect(false);
    
    const timer = setInterval(() => {
      this.logger.info("Starting update now")
      this.sendFile();
      clearInterval(timer);
    }, 5000, 'startUpdate');
  }

  async updateFinished(successful: boolean) {
    const toast = await this.toastCtrl.create({
      header: successful ? 'Update finished' : 'Update failed',
      message: 'The update was ' + (successful ? 'successful, device has been restarted.' : 'not successful.'),
      position: 'middle',
      color: successful ? 'success' : 'danger',
      animated: true,
      buttons: [{
        text: 'OK',
        role: 'ok'
      }]
    });
    await toast.present();
    const { role } = await toast.onDidDismiss();
    this.router.navigate(['']);
  }

  async sendFile() {
    this.totalSize = this.updateData.byteLength;
    this.partCount = (this.totalSize / part) + 1;


    await this.startOtaNotifications();

    await this.writeOtaData(Buffer.from([
      0xFE,
      this.totalSize >> 24 & 0xFF,
      this.totalSize >> 16 & 0xFF,
      this.totalSize >> 8 & 0xFF,
      this.totalSize & 0xFF
    ]));

    await this.writeOtaData(Buffer.from([
      0xFF,
      this.partCount / 256,
      this.partCount % 256,
      mtu / 256,
      mtu % 256
    ]));

    await this.writeOtaData(Buffer.from([0xFD]));
  }


  async handleNotification(value) {
    this.logger.info('handleNotification: ' + value.getUint8(0));
    switch (value.getUint8(0)) {
      case 0xAA:
        this.updateProgress(0, 'Starting transfer... ');
        this.logger.info('Start transfer');
        this.sendBufferedData.bind(this)(0);
        break
      case 0xF1:
        this.progressbarType = 'determinate';
        this.lastAcknowledged = value.getUint16(1);
        this.logger.info('Sending package ' + this.lastAcknowledged);
        this.sendBufferedData.bind(this)(this.lastAcknowledged);
        break
      case 0xF2:
        this.updateProgress(1, 'Installing firmware');
        this.logger.info('Starting firmware install');
        break
      case 0x0F:
      case 0x8C:
        let result = value.buffer;
        this.updateProgress(1, 'Finished update');
        this.logger.info('Finished update with result ', result);
        this.bleService.disconnect(true);
        await this.updateFinished(true);
        break
    }
  }

  async sendBufferedData(ack: number) {
    this.logger.debug('sendBufferedData: ' + this.lastSend++ + ', last ack. ' + ack);

      let start = ack * part;
      let end = (ack+1) * part;
      if(this.totalSize < end) {
        end = this.totalSize;
      }
      let dataLength = end - start
      this.logger.info('Start ', start, ' end ', end, ' lentgh ', length);

      /// loop
      let fullPakages = dataLength / mtu
      let position = start;
      this.logger.info('Sending ', fullPakages, ' full packages with ', mtu, ' bytes')
      for (let i = 0; i < fullPakages; i++) {
        this.dataToSend = this.updateData.slice(position, position+mtu);
        await this.writeOtaData(Buffer.concat([
          Buffer.from([0xFB, i]),
          Buffer.from(this.dataToSend)
        ]));
        position = position+mtu;
        this.lastSendTime = new Date().getTime();
      }
      /// loop

      if(dataLength % mtu !== 0) {
        this.logger.info('Sending remaining ', dataLength % mtu, ' bytes');
        this.dataToSend = this.updateData.slice(position, position+mtu);
        await this.writeOtaData(Buffer.concat([
          Buffer.from([0xFB, fullPakages]),
          Buffer.from(this.dataToSend)
        ]));
        position = position+mtu;
        this.lastSendTime = new Date().getTime();
      }

      this.updateProgress(position, 'Transfering... ' + (100 * this.progressNum).toPrecision(3) + '%');

      await this.writeOtaData(Buffer.concat([
        Buffer.from([0xFC,
          dataLength / 256,
          dataLength % 256,
          ack / 256,
          ack % 256
        ]),
      ]));
  
  }


  async loadVersions() {
    this.firmwareService.getVersioninfo().subscribe(result => {
      const versions = _filter(result.firmware, { hardware: [this.hardwareVersion] })
        .map(software => software.software)
        .splice(0, 6);
      // Add local file option
      versions.push("Local File");
      this.logger.debug('Versions: ' + versions);
      this.showPopup('Select firmware version', versions, true);
    });
  }

  async loadTypes() {
    const types = ['cob', 'uart', 'cob_uart']
    this.showPopup('Select firmware type', types, false);
  }

  async showPopup(title, versions, isVersionSelect) {
    const popover = await this.popoverController.create({
      component: ListpickerComponent,
      //cssClass: 'my-custom-class',
      componentProps: {
        title: title,
        items: versions
      },
      translucent: true
    });
    popover.present();
  
    const { data } = await popover.onDidDismiss();
    if (isVersionSelect) this.softwareVersion = data;  // <-- Set it here

    // Special handling for "Local File"
    if (isVersionSelect && data === "Local File") {
      this.firmwareString = 'Local File';
      const fileInput = document.getElementById("fileInputID") as HTMLInputElement;
      fileInput.click();
      return;
    }
    
    if (isVersionSelect) {
      this.firmwareString = data;
    } else {
      this.firmwareString = (data === undefined ? "" : data + '-') + this.softwareVersion;
    }
    this.logger.info('Selected version: ' + this.firmwareString);
    this.ionViewDidEnter();
  }

  async startOtaNotifications() {
    this.bleService.startNotifications(
      AppSettings.OTA_SERVICE_UUID,
      AppSettings.OTA_CHARACTERISTIC_TX_UUID,
      (value: DataView) => {
        this.handleNotification(value);
      });
  }

  async writeOtaData(data: Buffer) {
    try {
      await this.bleService.writeDataView(
        AppSettings.OTA_SERVICE_UUID,
        AppSettings.OTA_CHARACTERISTIC_RX_UUID,
        new DataView(data.buffer));
    } catch (error) {
      this.logger.error('Error BLE.write ' + error);
    }
  }

  async updateProgress(currentPosition: number, text: string) {
    this._zone.run(() =>  {
      this.progress = text;
      this.progressNum = currentPosition / this.totalSize; 
      if(this.progressNum >= 1) {
        this.progressbarType = "indeterminate";
      }
      this.logger.info('progressNum: ' + this.progressNum)
    });
  }
}
