import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class EntrepreneurService {
  url = `${environment.baseUrl}/entrepreneurs`;
  logoUrl = `${environment.baseUrl}/organizations`;

  constructor(private http: HttpClient) {}

  findAllEntrepreneurs(search: string, page: number) {
    const pageNumber = page - 1;
    return this.http.get(`${this.url}?name=${search}&page=${pageNumber}`);
  }

  findEntrepreneurById(id: string) {
    return this.http.get(`${this.url}/id/${id}`);
  }

  findMe() {
    return this.http.get(`${this.url}/me`);
  }

  updateEntrepreneurProfile(data: any) {
    return this.http.patch(`${this.url}/me`, data);
  }

  uploadLogoImage(id: string, data: any) {
    return this.http.put(`${this.logoUrl}/${id}/logoUrl`, data);
  }
}
