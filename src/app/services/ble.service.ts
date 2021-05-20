import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BleClient, BleDevice } from '@capacitor-community/bluetooth-le';
import { ToastController } from '@ionic/angular';
import { AppSettings } from '../AppSettings';


@Injectable({
    providedIn: 'root'
})
export class BleService {

    device: BleDevice

    constructor(
        private router: Router,
        private toastCtrl: ToastController) { }

    async connect() {
        try {
            BleClient.initialize();

            //check if BLE is enabled on device, otherwise ask the user to turn on
            const isEnabled = await BleClient.getEnabled();
            console.log("Is BLE enabled: " + isEnabled)

            this.device = await BleClient.requestDevice({
                services: [AppSettings.ESP_SERVICE_UUID],
                optionalServices: [AppSettings.OTA_SERVICE_UUID]
            })

            await BleClient.connect(this.device.deviceId);

            console.log('connected to device ' + this.device.name + '(' + this.device.deviceId + ')');

        } catch (error) {
            this.presentToast(error);
        }
    }

    async disconnect() {
        BleClient.disconnect(this.device.deviceId).then(() => {
            console.log('Disconnected from device ')
            this.router.navigate([''])
        }).catch((error) => {
            console.error('Unable to disconnect ' + error)
        })
    }

    async write(str: string) {
        var buf = new ArrayBuffer(str.length); // 2 bytes for each char
        var bufView = new Uint8Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        await BleClient.write(
            this.device.deviceId,
            AppSettings.ESP_SERVICE_UUID,
            AppSettings.CONF_CHAR_UUID,
            new DataView(buf)
        )
    }

    async readVersion() {
        return await BleClient.read(
            this.device.deviceId,
            AppSettings.OTA_SERVICE_UUID,
            AppSettings.VERSION_CHAR_UUID,
        );
    }

    async presentToast(error) {
        const toast = await this.toastCtrl.create({
            header: "Bluetooth not supported",
            message: 'Your browser does not support BLE or it is not activated. (' + error + ')',
            animated: true,
            color: "danger",
            position: "middle",
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
        toast.present();
    }
}
