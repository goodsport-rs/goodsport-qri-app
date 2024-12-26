import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class VerifyService {
  verificationBaseUrl = `${environment.baseUrl}`;

  constructor(private http: HttpClient) {}


  verifyEmailWithToken(uuid: string) {
    return this.http.get(`${this.verificationBaseUrl}/verify/${uuid}`);
  }

  resendEmail(email: string) {
    return this.http.get(`${this.verificationBaseUrl}/verify/resend/${email}`);
  }
}
