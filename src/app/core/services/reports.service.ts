import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  reportsUrl = `${environment.baseUrl}/projects`;

  constructor(private http: HttpClient) {}

  findAll(search: string, page: number) {
    const pageNumber = page - 1;
    return this.http.get(`${this.reportsUrl}/reports?name=${search}&page=${pageNumber}`);
  }
  findByProjectId(projectId: string, page: number) {
    const pageNumber = page - 1;
    return this.http.get(`${this.reportsUrl}/id/${projectId}/reports?page=${pageNumber}`);
  }

  getAllProjectPhaseWithQuestionnaries(phase: string) {
    return this.http.get(`${this.reportsUrl}/questionnaires/phase/${phase}`);
  }
}
