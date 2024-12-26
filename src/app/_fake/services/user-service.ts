import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import { IRoleModel } from './role.service';
import {environment} from "../../../environments/environment";
export interface DataTablesResponse {
  content?: any[];
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
  data?: any[];
}

export interface IUserModel {
    avatar?: null | string;
    created_at?: string;
    email: string;
    email_verified_at?: string;
    id: number;
    last_login_at?: null | string;
    last_login_ip?: null | string;
    name?: string;
    profile_photo_path?: null | string;
    updated_at?: string;
    password?: string;
    roles?: IRoleModel[];
    role?: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private apiUrl = environment.apiBaseURL;


    constructor(private http: HttpClient) { }

  getUsers(dataTablesParameters: any): Observable<DataTablesResponse> {
    let params = new HttpParams()
      .set('page', dataTablesParameters.start / dataTablesParameters.length)
      .set('size', dataTablesParameters.length);

    return this.http.get<DataTablesResponse>(this.apiUrl+"/admin/api/users", { params }).pipe(
      map(response => ({
        content: response.content,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        size: response.size,
        number: response.number
      }))
    );
  }
    getUser(id: number): Observable<IUserModel> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<IUserModel>(url);
    }

    createUser(user: IUserModel): Observable<IUserModel> {
        return this.http.post<IUserModel>(this.apiUrl, user);
    }

    updateUser(id: number, user: IUserModel): Observable<IUserModel> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.put<IUserModel>(url, user);
    }

    deleteUser(id: number): Observable<void> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.delete<void>(url);
    }
}
