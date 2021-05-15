import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class FirmwareService {
    url = 'https://thank-the-maker.org/rescue';
   
    /**
     * Constructor of the Service with Dependency Injection
     * @param http The standard Angular HttpClient to make requests
     */
    constructor(private http: HttpClient) { }
   
    /**
    * Get version file from remote 
    */
    getVersioninfo(): Observable<any> {
      return this.http.get(`${this.url}/version.json`)
    }

    getFirmwareFile(version: string) : Observable<any> {
      return this.http.get(`${this.url}/firmware-${version}.bin`, {
        responseType: 'arraybuffer'
      }).pipe()
    }
  }