import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class InvestmentService {
  url = `${environment.baseUrl}/investments`;

  constructor(private http: HttpClient) {}

  findInvestments(search: string, page: number) {
    const pageNumber = page - 1;
    return this.http.get(`${this.url}?name=${search}&page=${pageNumber}&sort=createdDateTime,desc`);
  }

  findInvestmentsByInvestor(investorId : string, page: number) {
    const pageNumber = page - 1;
    return this.http.get(`${this.url}/investors/id/${(investorId)}?page=${pageNumber}&sort=createdDateTime,desc`);
  }

  findInvestmentsByInvestorUser(page: number) {
    const pageNumber = page - 1;
    return this.http.get(`${this.url}?page=${pageNumber}&sort=createdDateTime,desc`);
  }

  findInvestmentsByProjectId(projectId: string) {
    return this.http.get(`${this.url}/projects/${projectId}`);
  }
}
