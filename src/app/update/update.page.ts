import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { LoadingController, ToastController } from '@ionic/angular';
import { FirmwareService } from '../services/firmware.service';
import { AppSettings } from '../AppSettings';

const characteristicSize = 512;

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  progress : string
  progressNum : number
  version : string
  deviceId : string
  updateData : any
  dataToSend : any
  checksum: string
  totalSize : number
  remaining : number
  amountToWrite : number
  currentPosition : number
  loading: any;
  downloadFinished: boolean = false

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private firmwareService: FirmwareService) { 
      this.progress = 'starting update, please wait...';
      this.progressNum = 0;
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.deviceId = this.router.getCurrentNavigation().extras.state.deviceId
          this.version = this.router.getCurrentNavigation().extras.state.version;
        }
      })
  }

  ngOnInit() {
    this.loading = this.showLoadingIndicator('Downloading firmware, please wait...');
    this.firmwareService.getChecksum(this.version).subscribe(result => {
      this.checksum = result;
    })
    this.firmwareService.getFirmwareFile(this.version).subscribe(result => {
      this.loading.dismiss();
      this.totalSize = result.byteLength
      this.downloadFinished = true
      this.updateDevice(result)
    })
  }

  async showLoadingIndicator(message: string) {
     this.loading = await this.loadingCtrl.create({
      message
    });
    return await this.loading.present();
  }

  async updateDevice(data) {
    let byteCount = data.byteLength
    console.log('started update to version ' + this.version)
    console.log('filesize bytes ' + byteCount)
    this.updateData = data
    this.sendFileOverBluetooth()
  }

  async updateFinished(successful: boolean) {
    const toast = await this.toastCtrl.create({
      header: successful ? 'Update finished' : 'Update failed',
      message: 'Your update was ' + (successful ? 'successful, please restart your device.' : 'not successful.'),
      position: 'middle',
      color: successful ? 'success' : 'danger',
      animated: true,
      buttons: [ {
          text: 'OK',
          role: 'ok'
        }]
    });
    await toast.present();
    const { role } = await toast.onDidDismiss();
    this.router.navigate([''])  
  }


  sendFileOverBluetooth() {
    this.totalSize = this.updateData.byteLength;
    this.remaining = this.totalSize;
    this.amountToWrite = 0;
    this.currentPosition = 0;

    BleClient.startNotifications(
      this.deviceId,
      AppSettings.OTA_SERVICE_UUID,
      AppSettings.FILE_CHAR_UUID,
      this.sendBufferedData.bind(this)
    )
    this.sendBufferedData()
  }
  
   async sendBufferedData() {
    console.log("sendBufferedData: ");
    if (this.remaining > 0) {
      if (this.remaining >= characteristicSize) {
        this.amountToWrite = characteristicSize
      }
      else {
        this.amountToWrite = this.remaining;
      }
      this.dataToSend = this.updateData.slice(this.currentPosition, this.currentPosition + this.amountToWrite);
      this.currentPosition += this.amountToWrite;
      this.remaining -= this.amountToWrite;
      console.log("remaining: " + this.remaining);

      await BleClient.write(
        this.deviceId,
        AppSettings.OTA_SERVICE_UUID,
        AppSettings.FILE_CHAR_UUID,
        this.dataToSend
      )

      this.progressNum = this.currentPosition/this.totalSize
      this.progress = (100 * this.progressNum).toPrecision(3) + '%'
      if(this.progressNum >= 1) {
        this.updateFinished(true);
      }
    }
  }
}
