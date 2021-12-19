import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationExtras, NavigationStart, Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import {FirmwareService} from '../services/firmware.service';
import {BleService} from '../services/ble.service';
import {RescueData} from '../RescueData';
import {OverviewChartComponent} from '../charts/overview-chart/overview-chart.component';
import {AppSettings} from '../AppSettings';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import {filter} from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss'],
})
export class DevicePage implements OnInit, OnDestroy {

  @ViewChild('overviewChart')
  overviewChart: OverviewChartComponent;

  skipIncompatibleCheck = false;
  autoconnect = false;
  showCardDetails = true;
  showCardDetailsText = '';
  deviceId: string;
  deviceName: string;
  softwareVersion: string;
  hardwareVersion: string;
  isFirstUpdateCheck = true;
  timerId: any;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private firmwareService: FirmwareService,
    private bleService: BleService,
    public rescueData: RescueData,
    private localNotifications: LocalNotifications,
    private logger: NGXLogger
) {
    router.events
      .pipe(filter((event: NavigationStart) => {
        return (event instanceof NavigationStart);
      }))
      .subscribe((event: NavigationStart) => {
        if (event.restoredState !== undefined) {
          this.logger.debug('restoredState');
          this.subscribeRescueConf();
        }
      });
  }

  ngOnInit() {
    this.logger.debug('entered device page');
    this.skipIncompatibleCheck = localStorage.getItem('skipIncompatibleCheck') === 'true';
    this.autoconnect = localStorage.getItem('autoconnect') === 'true';
    this.showCardDetails = localStorage.getItem('showCardDetails') === 'true';
    if (this.showCardDetails) {
      this.showCardDetailsText = 'Hide details';
    } else {
      this.showCardDetailsText = 'Show details';
    }
    this.isFirstUpdateCheck = true;
    this.deviceId = this.bleService.device.deviceId;
    this.deviceName = this.bleService.device.name;

    this.bleService.checkServiceAvailable(AppSettings.RESCUE_SERVICE_UUID).then((available) => {
      if (!available && !this.skipIncompatibleCheck) {
        this.logger.warn('Incompatible version of rESCue firmware');
        this.router.navigate(['/incompatible']);
        return;
      }

      this.readVersion().then(() => {
        this.getFirmwareVersions();
      });

      this.subscribeRescueConf();
      this.subscribeVesc();

      //this.checkValues();
      this.startTimer();
    });
  }

  private startTimer() {
    this.timerId = setInterval(() => {
      this.update();
    }, 1000);
  }

  private subscribeVesc() {
    this.bleService.startNotifications(AppSettings.VESC_SERVICE_UUID,
      AppSettings.VESC_CHARACTERISTICS_TX_UUID, (value: DataView) => {
        // this.parser.push(value.buffer);
      });
  }

  private subscribeRescueConf() {
    this.bleService.startNotifications(AppSettings.RESCUE_SERVICE_UUID,
      AppSettings.RESCUE_CHARACTERISTIC_UUID_CONF, (value: DataView) => {
        const values = String.fromCharCode.apply(null, new Uint8Array(value.buffer)).split('=');
        this.logger.debug('Received: ' + values);
        if (values[0] === 'vesc.current') {
          this.rescueData.current = Math.abs(Number(values[1]));
        } else if (values[0] === 'vesc.tachometer') {
          this.rescueData.tachometer = Math.abs(Number(values[1]));
        } else if (values[0] === 'vesc.dutyCycle') {
          this.rescueData.dutyCycle = Math.abs(Number(values[1]));
        } else if (values[0] === 'vesc.erpm') {
          this.rescueData.erpm = Math.abs(Number(values[1]));
        } else if (values[0] === 'vesc.voltage') {
          this.rescueData.battery = Number(values[1]);
        } else if (values[0] === 'loopTime') {
          this.rescueData.loopTime = Number(values[1]);
        } else if (values[0] === 'maxLoopTime') {
          this.rescueData.maxLoopTime = Number(values[1]);
        }
      });
  }

  ngOnDestroy() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  async disconnect(rebootToRescue: boolean) {
    if (rebootToRescue) {
      this.logger.info('Reboot to rESCue requested');
      let str = 'otaUpdateActive=false';
      await this.bleService.write(AppSettings.RESCUE_SERVICE_UUID,
        AppSettings.RESCUE_CHARACTERISTIC_UUID_CONF, str);
      str = 'save=true';
      await this.bleService.write(AppSettings.RESCUE_SERVICE_UUID,
        AppSettings.RESCUE_CHARACTERISTIC_UUID_CONF, str);

    }
    await this.bleService.disconnect();
  }

  async readVersion() {
    const result = await this.bleService.readVersion();
    this.hardwareVersion = 'v' + result.getUint8(0) + '.' + result.getUint8(1);
    this.softwareVersion = 'v' + result.getUint8(2) + '.' + result.getUint8(3) + '.' + result.getUint8(4);
    this.logger.info('Hardware-Version: ' + this.hardwareVersion);
    this.logger.info('Software-Version: ' + this.softwareVersion);
  }

  getFirmwareVersions() {
    this.firmwareService.getVersioninfo().subscribe(result => {
      this.logger.info('Firmware: ' + JSON.stringify(result));
      this.checkForUpdate(result);
    });
  }

  checkForUpdate(data) {
    let softwareVersionCount = 0;
    let latestCompatibleSoftware: string = data.firmware[softwareVersionCount].software;
    versionFindLoop:
      while (latestCompatibleSoftware !== undefined) {
        let compatibleHardwareVersion = 'N/A';
        let hardwareVersionCount = 0;
        while (compatibleHardwareVersion !== undefined) {
          if (data.firmware[softwareVersionCount] === undefined) {
            break versionFindLoop;
          }
          compatibleHardwareVersion = data.firmware[softwareVersionCount].hardware[hardwareVersionCount++];
          if (compatibleHardwareVersion === this.hardwareVersion) {
            latestCompatibleSoftware = data.firmware[softwareVersionCount].software;
            if (latestCompatibleSoftware.replace('/[v\.]/g', '') > this.softwareVersion.replace('/[v\.]/g', '')) {
              this.logger.info('latest compatible version: ' + latestCompatibleSoftware);
              this.promptForUpdate(true, latestCompatibleSoftware, this.hardwareVersion);
              return;
            }
            break versionFindLoop;
          }
        }
        softwareVersionCount++;
      }
    if (!this.isFirstUpdateCheck) {
      this.promptForUpdate(false, this.softwareVersion, this.hardwareVersion);
    } else {
      this.isFirstUpdateCheck = false;
    }
  }

  async promptForUpdate(isUpdateAvailable: boolean, softwareVersion: string, hardwareVersion: string) {
    let toast;
    if (isUpdateAvailable) {
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
              this.logger.debug('Update clicked');
              const navigationExtras: NavigationExtras = {
                state: {
                  deviceId: this.bleService.device.deviceId,
                  deviceName: this.bleService.device.name,
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
              this.logger.debug('Cancel clicked');
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
            text: 'Force',
            handler: () => {
              this.logger.debug('Force update clicked');
              const navigationExtras: NavigationExtras = {
                state: {
                  deviceId: this.bleService.device.deviceId,
                  deviceName: this.bleService.device.name,
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

  livedata() {
    this.router.navigate(['/livedata']);
  }

  async update() {
    if (this.overviewChart.speedData[0] !== this.rescueData.tachometer) {
      this.overviewChart.speedData[0] = this.rescueData.tachometer;
      this.overviewChart.speedUpdateFlag = true;
    }

    if (this.overviewChart.dutyData[0] !== this.rescueData.dutyCycle) {
      this.overviewChart.dutyData[0] = this.rescueData.dutyCycle;
      this.overviewChart.dutyUpdateFlag = true;
    }

    if (this.overviewChart.batteryData[0] !== this.rescueData.battery) {
      this.overviewChart.batteryData[0] = this.rescueData.battery;
      this.overviewChart.batteryUpdateFlag = true;
    }

    if (this.overviewChart.erpmData[0] !== this.rescueData.erpm) {
      this.overviewChart.erpmData[0] = this.rescueData.erpm;
      this.overviewChart.erpmUpdateFlag = true;
    }

    if (this.overviewChart.currentData[0] !== this.rescueData.current) {
      this.overviewChart.currentData[0] = this.rescueData.current;
      this.overviewChart.currentUpdateFlag = true;
    }

  }

  toggleAutoconnect(event) {
    const autoconnect = event.detail.checked;
    this.logger.info('Autoconnect is now ' + autoconnect);
    localStorage.setItem('autoconnect', autoconnect);
    localStorage.setItem('deviceId', this.deviceId);
  }

  toggleCard() {
    this.showCardDetails = !this.showCardDetails;
    if (this.showCardDetails) {
      this.showCardDetailsText = 'Hide details';
    } else {
      this.showCardDetailsText = 'Show details';
    }
    localStorage.setItem('showCardDetails', String(this.showCardDetails));
  }

  push(title: string, message: string) {
    this.localNotifications.schedule({
      title,
      text: message,
      foreground: true
    });
  }

  checkValues() {
    const minVoltage = 42;
    const maxVoltage = 50;
    const maxCurrent = 10;
    const maxErpm = 8000;
    if (this.rescueData.battery < minVoltage) {
      this.push('Warning: Battery low', 'Battery level under ' + minVoltage + 'V');
    }
    if (this.rescueData.battery > maxVoltage) {
      this.push('Warning: Battery high', 'Battery level over ' + maxVoltage + 'V');
    }
    if (this.rescueData.current < maxCurrent) {
      this.push('Warning: Current high', 'Current is above ' + maxCurrent + 'A for over 10 seconds');
    }
    if (this.rescueData.erpm > maxErpm) {
      this.push('Warning: ERPM high', 'ERPM is over ' + maxErpm + 'V');
    }
  }
}
