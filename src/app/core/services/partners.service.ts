import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class PartnersService {
  partnersUrl = `${environment.baseUrl}/partners`;

  constructor(private http: HttpClient) {}

  findAll(search: string, page: number) {
    const pageNumber = page - 1;
    return this.http.get(`${this.partnersUrl}?name=${search}&page=${pageNumber}`);
  }

  list() {
    return this.http.get(`${this.partnersUrl}/all`);
  }

  findById(id: string) {
    return this.http.get(`${this.partnersUrl}/id/${id}`);
  }

  save(data: any) {
    return this.http.post(`${this.partnersUrl}`, data);
  }
}
