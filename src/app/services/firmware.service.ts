import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import {NGXLogger} from "ngx-logger";


@Injectable({
    providedIn: 'root'
  })
  export class FirmwareService {
    versionFilelUrl = 'https://rescue.thank-the-maker.org/firmware/version.json';
    releaseUrl = 'https://rescue.thank-the-maker.org/firmware';
    rESCueLocalURL = 'http://192.168.4.1';
    //rESCueLocalURL = 'https://rescue.local';

    /**
     * Constructor of the Service with Dependency Injection
     * @param http The standard Angular HttpClient to make requests
     */
    constructor(
      private http: HttpClient,
      private logger: NGXLogger) { }

    /**
    * Get version file from remote
    */
    getVersioninfo(): Observable<any> {
      return this.http.get(`${this.versionFilelUrl}`);
    }

    getFirmwareFile(version: string, ) : Observable<any> {
      return this.http.get(`${this.releaseUrl}/firmware-${version}.bin`, {
        responseType: 'arraybuffer'
      }).pipe(
        timeout(10000)
      );
    }

    getChecksum(version: string): Observable<any> {
      return this.http.get(`${this.releaseUrl}/firmware-${version}.sha256`, {
        responseType: 'text'
      }).pipe(
        timeout(10000)
      );
    }

    checkWiFiConnection(): Observable<any> {
      return this.http.get(this.rESCueLocalURL + '/ping', {
        responseType: 'text'
      }).pipe(
        timeout(2000)
      );
    }

    postUpdateData(data: ArrayBuffer): Observable<any> {
      const formData: any = new FormData();
      this.logger.debug('sending ' + data.byteLength + ' bytes');

      formData.append('data', btoa(String.fromCharCode.apply(null, new Uint8Array(data))));
      //formData.append("data", new Uint8Array(data));
      return this.http.post(this.rESCueLocalURL + '/update', formData, {
        responseType: 'text'
      }).pipe(
        timeout(10000)
      );
    }
  }
