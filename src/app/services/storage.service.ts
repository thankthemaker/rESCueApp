import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import {Storage} from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private logger: NGXLogger) {
  }

  async keys() {
    return Storage.keys();
  }

  async get(key: string) {
    return (await Storage.get({ key })).value;
  }

  async getBoolean(key: string) {
    return Boolean((await Storage.get({ key })).value === 'true');
  }

  async set(key: string, value) {
    return Storage.set({ key, value: String(value) });
  }

  async clear() {
    return Storage.clear();
  }
}
