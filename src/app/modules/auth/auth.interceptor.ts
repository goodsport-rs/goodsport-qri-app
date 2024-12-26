import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.authToken) {
      return next.handle(req); // Proceed without modifying the request if no token is found
    }

    const authReq = req.clone({
      setHeaders: {
        'X-AUTH-TOKEN': auth.authToken // Use the token from the auth object
      }
    });

    return next.handle(authReq);
  }

  private getAuthFromLocalStorage(): any {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      return JSON.parse(lsValue);
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
