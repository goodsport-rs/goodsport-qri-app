import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class QuestionnairesService {
  url = `${environment.baseUrl}/questionnaires`;

  constructor(private http: HttpClient) {}

  findAllQuestionnaires(search: string, page: number, size: number) {
    const pageNumber = page - 1;
    return this.http.get(
      `${this.url}?name=${search}&page=${pageNumber}&size=${size}&sort=createdDateTime,desc`
    );
  }

  createQuestionnaire(data: any) {
    return this.http.post(this.url, data);
  }

  createQuestions(id: string, data: any) {
    return this.http.post(`${this.url}/${id}/questions`, data);
  }

  findOneQuestionnaire(id: string) {
    return this.http.get(`${this.url}/id/${id}`);
  }

  updateQuestion(id: string, questionId: string, data: any) {
    return this.http.patch(
      `${this.url}/id/${id}/questions/id/${questionId}`,
      data
    );
  }

  removeQuestion(id: string, questionId: string) {
    return this.http.delete(`${this.url}/id/${id}/questions/id/${questionId}`);
  }

  addQuestionnairePhase(data: any) {
    return this.http.post(`${this.url}/config`, data);
  }

  getQuestionnaireConfig() {
    return this.http.get(`${this.url}/config`);
  }

  updateQuestionnaireConfig(data: any) {
    return this.http.patch(`${this.url}/config`, data);
  }

  getOrganizationQuestionnaire() {
    return this.http.get(`${this.url}/organization`);
  }

  answerOrganizationQuestions(id: string, data: any) {
    return this.http.post(
      `${environment.baseUrl}/organizations/questionnaires/id/${id}/answers`,
      data
    );
  }

  getSubmittedQuestionnaire(id: string) {
    return this.http.get(
      `${environment.baseUrl}/organizations/${id}/questionnaire`
    );
  }

  publishQuestionnaire(id: string) {
    return this.http.put(`${this.url}/${id}/status/published`, {});
  }

  updateQuestionnaireOrder(id: string, data: any) {
    return this.http.patch(`${this.url}/id/${id}/questions/order`, data);
  }

}
