import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { ToastController } from '@ionic/angular';
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
  totalSize : number
  remaining : number
  amountToWrite : number
  currentPosition : number

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private toastCtrl: ToastController,
    private firmwareService: FirmwareService) { 
      this.progress = '0%';
      this.progressNum = 0;
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.deviceId = this.router.getCurrentNavigation().extras.state.deviceId
          this.version = this.router.getCurrentNavigation().extras.state.version;
        }
      })
  }

  ngOnInit() {
    this.firmwareService.getFirmwareFile(this.version).subscribe(result => {
      this.updateDevice(result)
    })
  }

  async updateDevice(data) {
    let byteCount = data.byteLength
    console.log('started update to version ' + this.version)
    console.log('filesize bytes ' + byteCount)
    this.updateData = data

    ///for(this.progress = 0; this.progress<100; this.progress = this.progress+5) {
    ///  console.log('Progress: ' + this.progress)
    ///  await this.delay(50)
    ///}
  
    this.sendFileOverBluetooth()

   ///this.updateFinished(true);
  }

  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) )
  }

  async updateFinished(successful: boolean) {
    const toast = await this.toastCtrl.create({
      header: successful ? 'Update finished' : 'Update failed',
      message: 'Your update was ' + (successful ? 'successful, please restart your device.' : 'not successful.'),
      position: 'middle',
      color: successful ? 'success' : 'danger',
      animated: true,
      buttons: [
        {
          text: 'OK',
          role: 'ok'
        }
      ]
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
  
   sendBufferedData() {
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

      BleClient.write(
        this.deviceId,
        AppSettings.OTA_SERVICE_UUID,
        AppSettings.FILE_CHAR_UUID,
        this.dataToSend
      )

      this.progressNum = this.currentPosition/this.totalSize
      this.progress = (100 * this.progressNum).toPrecision(3) + '%'
    }
  }
}
