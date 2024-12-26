// src/app/auth/guards/portal.guard.ts
import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router, ActivatedRoute, NavigationStart, Event as NavigationEvent } from '@angular/router';
import { environment } from 'src/environments/environment';
import {StorageService} from "./storage.service";

@Injectable({ providedIn: 'root' })
export class PortalGuard implements CanActivate {
  url: any;

  constructor(
    private service: StorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events.subscribe((event: NavigationEvent) => {
      if (event instanceof NavigationStart) {
        this.url = event.url;
      }
    });
  }

  canActivate() {
    const storage = this.service.getStorage(environment.USERDATA_KEY);
    console.log('storage', storage);
    if (!storage || !storage.idToken) {
      window.location.href = '/auth/login';
      return false;
    }
    if (!this.url) {
      this.url = window.location.pathname;
    }
    const role = storage.role;
    const path = this.url.split('/')[1];
    console.log('role', role);
    if (role === 'ROLE_ADMIN' && path !== 'admin') {
      this.router.navigate(['/admin']);
      return false;
    } else if (role === 'ROLE_ENTREPRENEUR' && path !== 'entrepreneure') {
      this.router.navigate(['/entrepreneure']);
      return false;
    } else if (role === 'ROLE_INVESTOR' && path !== 'investor') {
      this.router.navigate(['/investor']);
      return false;
    }
    return true;
  }
}
