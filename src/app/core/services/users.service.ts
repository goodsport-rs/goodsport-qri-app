import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  url = `${environment.baseUrl}/users`;

  constructor(private http: HttpClient) {}

  findAllUsers(search: string, page: number) {
    const pageNumber = page - 1;
    return this.http.get(`${this.url}?name=${search}&page=${pageNumber}`);
  }

  findUserById(id: string) {
    return this.http.get(`${this.url}/id/${id}`);
  }
  createUser(data: any) {
    return this.http.post(this.url, data);
  }

  verifyEmail(verificationToken: any) {

  }
}
