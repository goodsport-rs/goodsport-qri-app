import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {
  user: any = {};

  constructor() {}

  setStorage(key: string, value: unknown): void {
    this.user[key] = value;
    localStorage.setItem(key, JSON.stringify(value));
  }

  getStorage(key: string): any {
    if (this.user[key]) {
      return this.user[key];
    }
    let value: any = localStorage.getItem(key);
    if (typeof value === 'string') {
      value = JSON.parse(value);
    }
    return value ? (this.user[key] = value) : null;
  }
}
