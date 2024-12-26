import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../../models/user.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from '../../models/auth.model';
import {catchError, map} from "rxjs/operators";
import {AccountModel} from "../../models/account.model";

const API_USERS_URL = `${environment.apiBaseURL}`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) {}

  // public methods
  login(email: string, password: string): Observable<any> {
    const notFoundError = new Error('Not Found');
    if (!email || !password) {
      return of(notFoundError);
    }
    const headers = { 'Content-Type': 'application/json' };
    const body = {
      username: email,
      password: password
    };

    return this.http.post(API_USERS_URL+"/api/login", body, { headers }).pipe(
      map((response: any) => {
        const auth = new AuthModel();

        auth.authToken = response.idToken; // Adjust according to the actual response structure
        auth.refreshToken = response.id; // Adjust according to the actual response structure
        auth.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000); // Adjust according to the actual response structure
        return auth;
      })
    );
  }

  // CREATE =>  POST: add a new user to the server
  createUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  // Your server should check email => If email exists send link to the user and return true | If email doesn't exist return false
  forgotPassword(email: string): Observable<boolean> {
    return this.http.post<boolean>(`${API_USERS_URL}/forgot-password`, {
      email,
    });
  }

  getUserByToken(token: string): Observable<any> {
    const httpHeaders = new HttpHeaders({
      'X-AUTH-TOKEN': `${token}`,
    });
    return this.http.get<any>(`${API_USERS_URL}/api/auth/user-info`, {
      headers: httpHeaders,
    }).pipe(
      map((response: AccountModel) => {
        console.log('response', response);
        return response || undefined;
      }),
      catchError((error) => {
        console.error('error', error);
        return of(undefined);
      }
    ));
  }
}
