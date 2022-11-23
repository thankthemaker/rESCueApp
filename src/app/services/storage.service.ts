import {Injectable} from '@angular/core';
import {NGXLogger} from 'ngx-logger';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private logger: NGXLogger) {
  }

  async keys() {
    return Preferences.keys();
  }

  async get(key: string) {
    return (await Preferences.get({ key })).value;
  }

  async getBoolean(key: string) {
    return Boolean((await Preferences.get({ key })).value === 'true');
  }

  async set(key: string, value) {
    return Preferences.set({ key, value: String(value) });
  }

  async clear() {
    return Preferences.clear();
  }
}
