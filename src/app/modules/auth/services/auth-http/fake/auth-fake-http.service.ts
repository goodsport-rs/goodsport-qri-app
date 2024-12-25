import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserModel } from '../../../models/user.model';
import { AuthModel } from '../../../models/auth.model';
import { environment } from '../../../../../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { catchError,tap } from 'rxjs/operators';
const API_USERS_URL = `${environment.apiBaseURL}`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) {}


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

  // public methods

  createUser(user: UserModel): Observable<any> {
    user.roles = [2]; // Manager
    user.authToken = 'auth-token-' + Math.random();
    user.refreshToken = 'auth-token-' + Math.random();
    user.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
    user.pic = './assets/media/avatars/300-1.jpg';

    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  forgotPassword(email: string): Observable<boolean> {
    return this.getAllUsers().pipe(
      map((result: UserModel[]) => {
        const user = result.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        return user !== undefined;
      })
    );
  }

  getUserByToken(token: string): Observable<UserModel | undefined> {
    console.log('token auth request', token);

    const headers = new HttpHeaders({
      'X-AUTH-TOKEN': token,
    });

    console.log('Request headers:', headers);

    return this.http.get<UserModel>(`${API_USERS_URL}/api/users/me`, { headers }).pipe(
      tap((response: any) => {
        console.log('HTTP response:', response);
      }),
      map((response: any) => {
        console.log('response', response);
        const user = response.user; // Adjust according to the actual response structure
        return user || undefined;
      }),
      catchError((err) => {
        console.log('err', err.body.error);
        console.log('err', err);
        return of(undefined);
      })
    );
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${API_USERS_URL}/api/users`);
  }

}
