import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
  export class FirmwareService {
    versionFilelUrl = 'https://rescue.thank-the-maker.org/firmware/version.json';
    releaseUrl = 'https://rescue.thank-the-maker.org/firmware'
   
    /**
     * Constructor of the Service with Dependency Injection
     * @param http The standard Angular HttpClient to make requests
     */
    constructor(private http: HttpClient) { }
   
    /**
    * Get version file from remote 
    */
    getVersioninfo(): Observable<any> {
      return this.http.get(`${this.versionFilelUrl}`)
    }

    getFirmwareFile(version: string, ) : Observable<any> {
      return this.http.get(`${this.releaseUrl}/firmware-${version}.bin`, {
        responseType: 'arraybuffer'
      }).pipe(
        timeout(5000)
      )
    }

    getChecksum(version: string): Observable<any> {
      return this.http.get(`${this.releaseUrl}/firmware-${version}.sha256`, {
        responseType: 'text'
      }).pipe(
        timeout(5000)
      )
    }

    checkWiFiConnection(): Observable<any> {
      return this.http.get(`http://192.168.4.1/ping`, {
        responseType: 'text'
      }).pipe(
        timeout(2000)
      )
    }

    postUpdateData(data: ArrayBuffer): Observable<any> {
      let formData: any = new FormData();
      console.log("sending " + data.byteLength + " bytes")
      formData.append("data", btoa(String.fromCharCode.apply(null, new Uint8Array(data))));
      //formData.append("data", new Uint8Array(data));
      return this.http.post(`http://192.168.4.1/update`, formData, {
        responseType: 'text'
      }).pipe(
        timeout(5000)
      )
    }
  }