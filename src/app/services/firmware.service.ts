import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { AppSettings } from '../models/AppSettings';
import { NGXLogger } from 'ngx-logger';


@Injectable({
    providedIn: 'root'
  })
  export class FirmwareService {
    private versionFile = 'version.json';
    private deviceFile = 'devices.json';
    private firmwareUrl = 'https://rescue.thank-the-maker.org/firmware';

    /**
     * Constructor of the Service with Dependency Injection
     *
     * @param http The standard Angular HttpClient to make requests
     */
    constructor(
      private http: HttpClient,
      private logger: NGXLogger,
      private appSettings: AppSettings) { }

    /**
     * Get version file from remote
     */
    getVersioninfo(): Observable<any> {
      const versionInfoUrl = `${this.firmwareUrl}${this.appSettings.betaFirmwareUpdatesEnabled ? "/beta": ""}/${this.versionFile}`;
      this.logger.info(`loading versionfile ${versionInfoUrl}`);
      return this.http.get(versionInfoUrl);
    }

    /**
     * Get device file from remote
     */
    getDeviceinfo(): Observable<any> {
      const devicefileUrl = `${this.firmwareUrl}${this.appSettings.betaFirmwareUpdatesEnabled ? "/beta": ""}/${this.deviceFile}`
      this.logger.info(`loading devicefile ${devicefileUrl}`);
      return this.http.get(devicefileUrl);
    }

    getFirmwareFile(deviceString: string, version: string, ): Observable<any> {
      const firmwareFileUrl = `${this.firmwareUrl}${this.appSettings.betaFirmwareUpdatesEnabled ? "/beta": ""}/firmware_${deviceString}-${version}.bin`;
      this.logger.info(`loading firmwarefile ${firmwareFileUrl}`);
      return this.http.get(firmwareFileUrl, {
        responseType: 'arraybuffer'
      }).pipe(
        timeout(10000)
      );
    }

    getChecksum(deviceString: string, version: string): Observable<any> {
      const checksumfile = `${this.firmwareUrl}${this.appSettings.betaFirmwareUpdatesEnabled ? "/beta": ""}/firmware_${deviceString}-${version}.bin.sha256`;
      this.logger.info(`loading checksumfile ${checksumfile}`);
      return this.http.get(checksumfile, {
        responseType: 'text'
      }).pipe(
        timeout(10000)
      );
    }
  }
