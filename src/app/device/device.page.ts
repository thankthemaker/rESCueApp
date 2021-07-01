import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { FirmwareService } from '../services/firmware.service';
import { BleService } from '../services/ble.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss'],
})
export class DevicePage implements OnInit {

  deviceId: string;
  deviceName: string;
  softwareVersion: string;
  hardwareVersion: string;
  isFirstUpdateCheck = true;

  constructor(
      private router: Router,
      private toastCtrl: ToastController,
      private firmwareService: FirmwareService,
      private bleService: BleService) {}

  ngOnInit() {
    console.log('entered device page');
    this.isFirstUpdateCheck = true;
    this.deviceId = this.bleService.device.deviceId;
    this.deviceName = this.bleService.device.name;
    this.readVersion().then(() => {
      this.getFirmwareVersions();
    });
  }

  async disconnect(rebootToRescue: boolean) {
    if(rebootToRescue) {
      console.log('Reboot to rESCue requested');
      let str = 'otaUpdateActive=false';
      await this.bleService.write(str);
      str = 'save=true';
      await this.bleService.write(str);

    }
    await this.bleService.disconnect();
  }

  async readVersion() {
    const result = await this.bleService.readVersion();
    this.hardwareVersion = 'v' + result.getUint8(0) + '.' + result.getUint8(1);
    this.softwareVersion = 'v' + result.getUint8(2) + '.' + result.getUint8(3) + '.' + result.getUint8(4);
    console.log('Hardware-Version: ' + this.hardwareVersion);
    console.log('Software-Version: ' + this.softwareVersion);
  }

  getFirmwareVersions() {
    this.firmwareService.getVersioninfo().subscribe(result => {
      console.log('Firmware: ' + JSON.stringify(result));
      this.checkForUpdate(result);
    });
  }

  checkForUpdate(data) {
    let softwareVersionCount = 0;
    let latestCompatibleSoftware = data.firmware[softwareVersionCount].software;
    versionFindLoop:
      while (latestCompatibleSoftware !== undefined) {
        let compatibleHardwareVersion = 'N/A';
        let hardwareVersionCount = 0;
        while (compatibleHardwareVersion !== undefined) {
          if(data.firmware[softwareVersionCount] === undefined) {
            break versionFindLoop;
          }
          compatibleHardwareVersion = data.firmware[softwareVersionCount].hardware[hardwareVersionCount++];
          if (compatibleHardwareVersion === this.hardwareVersion) {
            latestCompatibleSoftware = data.firmware[softwareVersionCount].software;
            if (latestCompatibleSoftware !== this.softwareVersion) {
              console.log('latest compatible version: ' + latestCompatibleSoftware);
              this.promptForUpdate(true, latestCompatibleSoftware, this.hardwareVersion);
              return;
            }
            break versionFindLoop;
          }
        }
        softwareVersionCount++;
      }
      if(!this.isFirstUpdateCheck) {
        this.promptForUpdate(false, this.softwareVersion, this.hardwareVersion);
      } else {
        this.isFirstUpdateCheck = false;
      }
  }

  async promptForUpdate(isUpdateAvailable: boolean, softwareVersion: string, hardwareVersion: string) {
    let toast;
    if(isUpdateAvailable) {
        toast = await this.toastCtrl.create({
        header: 'Compatible update available - version ' + softwareVersion,
        message: 'Do you want to update your rESCue device?',
        position: 'middle',
        color: 'warning',
        animated: true,
        buttons: [
          {
             //side: 'start',
            icon: 'checkmark-circle',
            text: 'Yes',
            handler: () => {
              console.log('Update clicked');
              const navigationExtras: NavigationExtras = {
                state: {
                  deviceId: this.bleService.device.deviceId,
                  softwareVersion,
                  hardwareVersion,
                  currentVersion: Number.parseInt(this.softwareVersion.split('.').join('').substr(1), 10)
                }
              };
              this.router.navigate(['/update'], navigationExtras);
            }
          }, {
            icon: 'close-circle',
            text: 'No',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
    } else {
      toast = await this.toastCtrl.create({
        header: 'No compatible update available!',
        message: 'Your device is already running the latest version ' + softwareVersion,
        color: 'primary',
        position: 'middle',
        buttons: [
          {
            //side: 'start',
            icon: 'skull',
            text: 'Force update',
            handler: () => {
              console.log('Force update clicked');
              const navigationExtras: NavigationExtras = {
                state: {
                  deviceId: this.bleService.device.deviceId,
                  softwareVersion,
                  hardwareVersion,
                  currentVersion: Number.parseInt(this.softwareVersion.split('.').join('').substr(1), 10)
                }
              };
              this.router.navigate(['/update'], navigationExtras);
            }
          },
          {
            icon: 'close-circle',
            text: 'Close',
            role: 'cancel'
          }
        ]
      });
    }
    toast.present();
  }

  settings() {
    const navigationExtras: NavigationExtras = {
      state: {
        hardwareVersion: this.hardwareVersion,
        softwareVersion: this.softwareVersion
      }
    };
    this.router.navigate(['/settings'], navigationExtras);
  }
}
