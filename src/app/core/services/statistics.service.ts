import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  url = `${environment.baseUrl}/stats`;

  constructor(private http: HttpClient) {}

  findProjectDateCount() {
    return this.http.get(`${this.url}/project-count-date`);
  }

  findProjectCategoryCount() {
    return this.http.get(`${this.url}/project-count-category`);
  }

  findProjectCategoryCountByInvestor() {
    return this.http.get(`${this.url}/investors/project-count-category`);
  }

  findProjectDateCountByInvestor() {
    return this.http.get(`${this.url}/investors/project-count-date`);
  }

  findUsers() {
    return this.http.get(`${this.url}/users`);
  }

  getUserStats() {
    return this.http.get(`${this.url}/counts`);
  }
}
