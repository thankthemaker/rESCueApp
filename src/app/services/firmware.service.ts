import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

    getFirmwareFile(version: string) : Observable<any> {
      return this.http.get(`${this.releaseUrl}/firmware-${version}.bin`, {
        responseType: 'arraybuffer'
      }).pipe()
    }

    getChecksum(version: string): Observable<any> {
      return this.http.get(`${this.releaseUrl}/firmware-${version}.sha256`, {
        responseType: 'text'
      }).pipe()
    }
  }