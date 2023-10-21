import {Component, NgZone, ViewChild} from '@angular/core';
import {NavigationExtras, NavigationStart, Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import {FirmwareService} from '../services/firmware.service';
import {BleService} from '../services/ble.service';
import {RescueData} from '../models/RescueData';
import {OverviewChartComponent} from '../charts/overview-chart/overview-chart.component';
import {AppSettings} from '../models/AppSettings';
import {filter} from 'rxjs/operators';
import {NGXLogger} from 'ngx-logger';
import {generatePacket, VescMessageHandler, VescMessageParser} from '@thankthemaker/vesc-protocol';
import {Buffer} from 'buffer';
import {NotificationsService} from '../services/notification.service';
import {StorageService} from '../services/storage.service';
import {RescueConf} from '../models/RescueConf';

@Component({
  selector: 'app-device',
  templateUrl: './device.page.html',
  styleUrls: ['./device.page.scss'],
})
export class DevicePage {

  @ViewChild('overviewChart')
  overviewChart: OverviewChartComponent;

  lightsOn = true;
  connected = false;
  lastVescMessage = 0;
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
  lastNotifications: any = [];
  vescMessageParser: VescMessageParser;
  vescMessageHandler: VescMessageHandler;
  vescWorker: Worker;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private firmwareService: FirmwareService,
    private storageService: StorageService,
    public appSettings: AppSettings,
    public bleService: BleService,
    public rescueData: RescueData,
    public rescueConf: RescueConf,
    public notificationService: NotificationsService,
    private logger: NGXLogger,
    private _zone: NgZone) {
      this.vescMessageParser = new VescMessageParser();
    this.vescMessageHandler = new VescMessageHandler(this.vescMessageParser);
    this.vescMessageParser.subscribe((message) => {
      this.logger.debug(`message: ${JSON.stringify(message)}`);
      this.connected = true;
      this.lastVescMessage = Date.now();
      if (message.type === 'COMM_GET_VALUES') {
        this.rescueData.speed = undefined;
        this.rescueData.erpm = message.payload.erpm;
        this.rescueData.dutyCycle = message.payload.dutyCycle * 100;
        this.rescueData.battery = message.payload.voltage;
        //ToDo: Calculation based on config values
        this.rescueData.batteryLevel = Math.trunc(((this.rescueData.battery * 100.00 - 4000) / (5040 - 4000) * 100.00));
        this.rescueData.tachometer = message.payload.tachometer.value;
        this.rescueData.tachometerAbs = message.payload.tachometer.abs;
        if (message.payload.temp.motor > 0) {
          this.rescueData.motTemp = message.payload.temp.motor;
        } else {
          this.rescueData.motTemp = 0;
        }
        this.rescueData.fetTemp = message.payload.temp.mosfet;
        this.rescueData.current = message.payload.current.motor;
        this.rescueData.ampHours = message.payload.ampHours.consumed;
        this.rescueData.wattHours = message.payload.wattHours.charged;
        this.rescueData.faultCode = message.payload.faultCode;
      } else if (message.type === 'COMM_GET_VALUES_SETUP_SELECTIVE') {
        this.rescueData.speed = message.payload.speed * 3.5897435;
        this.rescueData.erpm = message.payload.erpm;
        this.rescueData.dutyCycle = message.payload.dutyCycle * 100;
        this.rescueData.battery = message.payload.voltage;
        this.rescueData.batteryLevel = message.payload.batteryLevel;
        this.rescueData.tachometer = message.payload.tachometer.value * 0.4385955;
        this.rescueData.tachometerAbs = message.payload.tachometer.abs * 0.4385955;
        if (message.payload.temp.motor > 0) {
          this.rescueData.motTemp = message.payload.temp.motor;
        } else {
          this.rescueData.motTemp = 0;
        }
        this.rescueData.fetTemp = message.payload.temp.mosfet;
        this.rescueData.current = message.payload.current.motor;
        this.rescueData.ampHours = message.payload.ampHours.consumed;
        this.rescueData.wattHours = message.payload.wattHours.charged;
        this.rescueData.faultCode = message.payload.faultCode;
      } else if ((message.type === 'COMM_FW_VERSION')) {
        this.rescueData.firmware = "" + message.payload.version.major + "." + 
          message.payload.version.minor + " " + message.payload.hardware;
          this.rescueData.uuid = "" + message.payload.uuid;
        }
      if (appSettings.metricSystemEnabled) {
        this.rescueData.speed = this.rescueData.speed * AppSettings.KM_2_MILES;
        this.rescueData.tachometer = this.rescueData.tachometer * AppSettings.KM_2_MILES;
        this.rescueData.tachometerAbs = this.rescueData.tachometerAbs * AppSettings.KM_2_MILES;
      }
    });

    router.events
      .pipe(filter((event: NavigationStart) => (event instanceof NavigationStart)))
      .subscribe((event: NavigationStart) => {
        if (event.restoredState !== undefined) {
          this.logger.debug('restoredState');
          //this.subscribeNotifications();
        }
      });
  }

  async ionViewDidEnter() {
    this.lastNotifications.minVoltage = 0;
    this.lastNotifications.maxVoltage = 0;
    this.lastNotifications.maxCurrent = 0;
    this.lastNotifications.maxErpm = 0;
    this.lastNotifications.maxDuty = 0;
    this.lastNotifications.maxSpeed = 0;
    this.skipIncompatibleCheck = await this.storageService.getBoolean('skipIncompatibleCheck');
    this.autoconnect = await this.storageService.getBoolean('autoconnect');
    this.showCardDetails = await this.storageService.getBoolean('showCardDetails');
    if (this.showCardDetails) {
      this.showCardDetailsText = 'Hide details';
    } else {
      this.showCardDetailsText = 'Show details';
    }
    this.isFirstUpdateCheck = true;
    this.deviceId = this.bleService.device.deviceId;
    this.deviceName = this.bleService.device.name;

    this.bleService.checkServiceAvailable(AppSettings.RESCUE_SERVICE_UUID).then((isRescue) => {
      this.logger.debug(`RESCUE_SERVICE_UUID available: ${isRescue}`);
      if (!isRescue && !this.skipIncompatibleCheck) {
        this.bleService.checkServiceAvailable(AppSettings.BLYNK_SERVICE_UUID).then((isOldRescue) => {
          this.logger.debug(`BLYNK_SERVICE_UUID available: ${isOldRescue}`);
          if (isOldRescue) {
            this.logger.warn('Incompatible version of rESCue firmware');
            this.router.navigate(['/incompatible']);
            return;
          } else {
            this.bleService.isRescueDevice = false;
          }
        });
      }
    });

    if (typeof Worker !== 'undefined') {
      // Create a new
      this.logger.debug('created web-worker for VESC');
/*
      this.vescWorker = new Worker(new URL('../vesc-worker.worker', import.meta.url), {type: 'module'});
      this.vescWorker.onmessage = ({data}) => {
        console.log(`page got message: ${data}`);
      };
*/
    } else {
      this.logger.error('web-worker not supported');
    }

    this.readVersion().then(() => {
      this.getFirmwareVersions();
    });

    this.subscribeNotifications();
    this.startTimer();
    this.readVescFirmwareInfo();
  }

  async ionViewDidLeave() {
    if (this.timerId) {
      await clearInterval(this.timerId);
    }
    this.unSubscribeNotifications();
  }

  async readVescFirmwareInfo() {
    const packet = generatePacket(Buffer.from([0x00])).buffer; // COMM_FW_VERSION
    await this.bleService.writeDataView(
      AppSettings.VESC_SERVICE_UUID,
      AppSettings.VESC_CHARACTERISTICS_RX_UUID,
      new DataView(packet)
    );
  }

  startTimer() {
    this.timerId = setInterval(() => {
      // const packet = generatePacket(Buffer.from([0x04])).buffer; // COMM_GET_VALUES
      const packet = generatePacket(Buffer.from([0x33, 0x0, 0x1, 0xFF, 0xFF])).buffer; // COMM_GET_VALUES_SETUP_SELECTIVE
      this.bleService.writeDataView(
        AppSettings.VESC_SERVICE_UUID,
        AppSettings.VESC_CHARACTERISTICS_RX_UUID,
        new DataView(packet)
      );
      this.update();
      this.checkValues();
      if (Date.now() - this.lastVescMessage > 2000) {
        this.connected = false;
      }
    }, 333);
  }

  subscribeNotifications() {
    this.bleService.startNotifications(AppSettings.RESCUE_SERVICE_UUID,
      AppSettings.RESCUE_CHARACTERISTIC_UUID_CONF, (value: DataView) => {
        const values = String.fromCharCode.apply(null, new Uint8Array(value.buffer)).split('=');
        if (!String(values[0]).startsWith('vesc')) {
          this.logger.debug('Received CONF: ' + values);
          this.rescueConf[values[0]] = values[1];
        }
      });
    this.bleService.startNotifications(AppSettings.RESCUE_SERVICE_UUID,
       AppSettings.CHARACTERISTIC_UUID_LOOP, (value: DataView) => {
        const values = String.fromCharCode.apply(null, new Uint8Array(value.buffer)).split('=');
        if (String(values[0]).endsWith('loopTime')) {
          this.logger.debug('Received LOOP: ' + values);
          this._zone.run(() =>  {
            const loopFigures = values[1].split(";");
            this.rescueData.loopCount = loopFigures[0]
            this.rescueData.avgLoopTime = loopFigures[1]
            this.rescueData.maxLoopTime = loopFigures[2]
          });
        }
      });
    this.bleService.startNotifications(AppSettings.VESC_SERVICE_UUID,
      AppSettings.VESC_CHARACTERISTICS_TX_UUID, (value: DataView) => {
        this.logger.debug('VESC data (', value.byteLength, ')byte: ', new Uint8Array(value.buffer).toString());
        this.vescMessageHandler.queueMessage(Buffer.from(value.buffer));
      });
  }

  unSubscribeNotifications() {
    this.bleService.stopNotifications(AppSettings.RESCUE_SERVICE_UUID,
      AppSettings.RESCUE_CHARACTERISTIC_UUID_CONF);
    this.bleService.stopNotifications(AppSettings.RESCUE_SERVICE_UUID,
      AppSettings.CHARACTERISTIC_UUID_LOOP);
    this.bleService.stopNotifications(AppSettings.VESC_SERVICE_UUID,
      AppSettings.VESC_CHARACTERISTICS_TX_UUID);
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
    await this.bleService.disconnect(true);
  }

  async readVersion() {
    const result = await this.bleService.readVersion();
    this.hardwareVersion = 'v' + result.getUint8(0) + '.' + result.getUint8(1);
    this.softwareVersion = 'v' + result.getUint8(2) + '.' + result.getUint8(3) + '.' + result.getUint8(4);
    this.logger.info('Hardware-Version: ' + this.hardwareVersion);
    this.logger.info('Software-Version: ' + this.softwareVersion);
  }

  getFirmwareVersions() {
    this.firmwareService.getDeviceinfo().subscribe(deviceResult => {
      this.logger.info('Devices: ' + JSON.stringify(deviceResult));
      let deviceString = deviceResult.devices[this.hardwareVersion];
      this.logger.info('Devicestring: ' + JSON.stringify(deviceString));
      this.firmwareService.getVersioninfo().subscribe(firmwareResult => {
        this.logger.info('Firmware: ' + JSON.stringify(firmwareResult));
        this.checkForUpdate(firmwareResult, deviceString);
      });
    });
  }

  checkForUpdate(data: any, deviceString: string) {
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
              this.promptForUpdate(true, latestCompatibleSoftware, this.hardwareVersion, deviceString);
              return;
            }
            break versionFindLoop;
          }
        }
        softwareVersionCount++;
      }
    if (!this.isFirstUpdateCheck) {
      this.promptForUpdate(false, this.softwareVersion, this.hardwareVersion, deviceString);
    } else {
      this.isFirstUpdateCheck = false;
    }
  }

  async promptForUpdate(isUpdateAvailable: boolean, softwareVersion: string, hardwareVersion: string, deviceString: string) {
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
                  deviceString: deviceString,
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
        htmlAttributes: [
          { myattribute: 'updateToast' }
        ],
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
                  deviceString: deviceString,
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

  toggleLights() {
    this.lightsOn = !this.lightsOn;
    this.bleService.write(AppSettings.RESCUE_SERVICE_UUID,
      AppSettings.RESCUE_CHARACTERISTIC_UUID_CONF,'lightsSwitch=' + this.lightsOn);
  }

  livedata() {
    this.router.navigate(['/livedata']);
  }

  async update() {
    let speed = 0;
    const rpm = Math.abs(this.rescueData.erpm / 15);
    if (this.rescueData.speed !== undefined) {
      speed = this.rescueData.speed;
    } else {
      speed = rpm * 0.27 * Math.PI * 2 / 1000;
    }

      this.overviewChart.updateSpeed(this.rescueData.speed);
      this.overviewChart.updateDuty(this.rescueData.dutyCycle);
      this.overviewChart.updateBattery(this.rescueData.battery);
      this.overviewChart.updateErpm(this.rescueData.erpm);
      this.overviewChart.updateCurrent(this.rescueData.current);
  }

  async toggleAutoconnect() {
    this.autoconnect = !this.autoconnect;
    this.logger.info('Autoconnect is now ' + this.autoconnect);
    await this.storageService.set('autoconnect', this.autoconnect);
    await this.storageService.set('deviceId', this.deviceId);
  }

  async toggleCard() {
    this.showCardDetails = !this.showCardDetails;
    if (this.showCardDetails) {
      this.showCardDetailsText = 'Hide details';
    } else {
      this.showCardDetailsText = 'Show details';
    }
    await this.storageService.set('showCardDetails', this.showCardDetails);
  }

  checkValues() {
    const millies = Date.now();
    if (!this.connected) {
      return;
    }
    if (this.rescueData.battery < this.appSettings.minVoltage) {
      if (millies - this.lastNotifications.minVoltage > this.appSettings.interval) {
        this.lastNotifications.minVoltage = millies;
        this.notificationService.push('Warning: Battery low', 'Battery level under ' + this.appSettings.minVoltage + 'V');
      }
    }
    if (this.rescueData.battery > this.appSettings.maxVoltage) {
      if (millies - this.lastNotifications.maxVoltage > this.appSettings.interval) {
        this.lastNotifications.maxVoltage = millies;
        this.notificationService.push('Warning: Battery high', 'Battery level over ' + this.appSettings.maxVoltage + 'V');
      }
    }
    if (Math.abs(this.rescueData.current) > this.appSettings.maxCurrent) {
      if (millies - this.lastNotifications.maxCurrent > this.appSettings.interval) {
        this.lastNotifications.maxCurrent = millies;
        this.notificationService.push('Warning: Current high', 'Current is above ' + this.appSettings.maxCurrent + 'A for over 10 seconds');
      }
    }
    if (Math.abs(this.rescueData.erpm) > this.appSettings.maxErpm) {
      if (millies - this.lastNotifications.maxErpm > this.appSettings.interval) {
        this.lastNotifications.maxErpm = millies;
        this.notificationService.push('Warning: ERPM high', 'ERPM is over ' + this.appSettings.maxErpm);
      }
    }
    if (Math.abs(this.rescueData.dutyCycle) > this.appSettings.maxDuty) {
      if (millies - this.lastNotifications.maxDuty > this.appSettings.interval) {
        this.lastNotifications.maxDuty = millies;
        this.notificationService.push('Warning: DutyCycle high', `DutyCycle is over ${this.appSettings.maxDuty} %`);
      }
    }
    if (Math.abs(this.rescueData.speed) > this.appSettings.maxSpeed) {
      if (millies - this.lastNotifications.maxSpeed > this.appSettings.interval) {
        this.lastNotifications.maxSpeed = millies;
        this.notificationService.push('Warning: Speed high', 'Speed is over ' + this.appSettings.maxSpeed);
      }
    }
  }
}
