import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class InvestorService {
  investorUrl = `${environment.baseUrl}/investors`;
  projectUrl = `${environment.baseUrl}/projects`;
  categoryUrl = `${environment.baseUrl}/categories`;
  logoUrl = `${environment.baseUrl}/organizations`;

  constructor(private http: HttpClient) {}

  findAllInvestors(search: string, page: number) {
    const pageNumber = page - 1;
    return this.http.get(`${this.investorUrl}?name=${search}&page=${pageNumber}`);
  }

  findInvestorById(id: string) {
    return this.http.get(`${this.investorUrl}/id/${id}`);
  }

  findMe() {
    return this.http.get(`${this.investorUrl}/me`);
  }

  findAllCategories() {
    return this.http.get(this.categoryUrl);
  }

  updateInvestorPreferences(data: any) {
    return this.http.put(`${this.investorUrl}/preferences`, data);
  }

  updateInvestorProfile(data: any) {
    return this.http.patch(`${this.investorUrl}/me`, data);
  }

  uploadLogoImage(id: string, data: any) {
    return this.http.put(`${this.logoUrl}/${id}/logoUrl`, data);
  }

  findInvestorProjects(search: string, page: number, size: number) {
    const pageNumber = page - 1;
    return this.http.get(
      `${this.investorUrl}/projects?name=${search}&page=${pageNumber}&size=${size}`
    );
  }

  findInvestorProjectsByState(search: string, state: string, page: number, size: number) {
    const pageNumber = page - 1;
    return this.http.get(
      `${this.investorUrl}/projects?name=${search}&state=${state}&page=${pageNumber}&size=${size}&sort=createdDateTime,desc`
    );
  }
}
