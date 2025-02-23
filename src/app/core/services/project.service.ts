import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {environment} from 'src/environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class ProjectService {
  projectsUrl = `${environment.baseUrl}/projects`;
  findInvestorProjectsUrl = `${environment.baseUrl}/investors/projects`;
  fundUrl = `${environment.baseUrl}/fund`;
  courseUrl = `${environment.baseUrl}/media/courses`;
  surveysUrl = `${environment.baseUrl}/media/surveys`;
  mediaUrl = `${environment.baseUrl}/media`;
  categoryUrl = `${environment.baseUrl}/categories`;
  reportUrl = `${environment.rootUrl}/reports`;

  public continueTo: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public reportsData = {
    rep1: null,
    rep2: null,
  }
  projectId: any;
  editReport: any;

  constructor(private http: HttpClient) {
  }

  findAllProjects(search: string, phase: string, status: string, page: number, size: number) {
    const pageNumber = page - 1;
    return this.http.get(
      `${this.projectsUrl}?name=${search}&phase=${phase}&status=${status}&page=${pageNumber}&size=${size}&sort=createdDateTime,desc`
    );
  }


  findProjectById(id: string) {
    return this.http.get(`${this.projectsUrl}/id/${id}`);
  }

  findProjectPhases() {
    return this.http.get(`${this.projectsUrl}/phases`);
  }

  findProjectStatuses() {
    return this.http.get(`${this.projectsUrl}/statuses`);
  }

  findOnlyProjectPhaseQuestionnaires(id: string, phase: string): Observable<any> {
    return this.http.get(
      `${this.projectsUrl}/id/${id}/phase/${phase}/questionnaire`
    ).pipe(
      map(
        (response: any) => {
          return response;
        },
        (error: object) => {
          return error;
        }
      )
    );
  }

  findProjectPhaseQuestionnaires(id: string, phase: string) {
    return this.http.get(
      `${this.projectsUrl}/id/${id}/phase/${phase}/questionnaire/answers`
    );
  }

  approveRejectProject(id: string, type: string) {
    return this.http.put(`${this.projectsUrl}/id/${id}/status/${type}`, {});
  }

  getProjectFiles(id: string) {
    return this.http.get(`${this.projectsUrl}/id/${id}/files`);
  }

  fundProject(data: any) {
    return this.http.post(`${this.fundUrl}`, data);
  }

  downloadProjectFile(projectId: string, fileId: number) {
    return this.http.get(`${this.projectsUrl}/id/${projectId}/files/id/${fileId}`, {
      responseType: 'blob',
    });
  }

  findProjectReportsByIdAndRangeExport(id: string, startDate: string, endDate: string, locality: string) {
    return this.http.get(`${this.projectsUrl}/id/${id}/reports/export?startDate=${startDate}&endDate=${endDate}&locality=${locality}`, {
      responseType: 'blob',
    });
  }

  findProjectCourses() {
    return this.http.get(this.courseUrl);
  }

  findSurveys() {
    return this.http.get(this.surveysUrl);
  }


  findAllMedia() {
    return this.http.get(this.mediaUrl);
  }

  findAllCategories() {
    return this.http.get(this.categoryUrl);
  }

  createProject(data: any) {
    console.log(data);
    return this.http.post(this.projectsUrl, data);
  }

  reworkProject(id: string, data: any) {
    return this.http.put(`${this.projectsUrl}/id/${id}/status/pending`, data);
  }

  updateProject(id: string, phase: string, data: any) {
    return this.http.patch(`${this.projectsUrl}/id/${id}/phase/${phase}`, data);
  }

  answerProjectQuestions(id: string, questionId: string, data: any) {
    return this.http.post(
      `${this.projectsUrl}/id/${id}/questionnaires/id/${questionId}/answers`,
      data
    );
  }


  editProjectAnswers(id: string, questionId: string, data: any) {
    return this.http.patch(
      `${this.projectsUrl}/id/${id}/questionnaires/id/${questionId}/answers`,
      data
    );
  }

  uploadProjectFiles(id: string, data: any) {
    return this.http.post(`${this.projectsUrl}/id/${id}/files`, data);
  }

  uploadImage(id: string, data: any) {
    return this.http.post(`${this.projectsUrl}/id/${id}/image`, data);
  }

  completeProjectQuestionnaire(id: string) {
    return this.http.put(
      `${this.projectsUrl}/id/${id}/questionnaire/status/completed`,
      {}
    );
  }

  answerComments(id: string, data: any) {
    return this.http.post(
      `${environment.baseUrl}/answers/id/${id}/comments`,
      data
    );
  }

  findInterestedInvestors(id: string) {
    return this.http.get(`${environment.baseUrl}/investments/projects/${id}`);
  }

  approveRejectInvestor(id: string, type: string) {
    return this.http.put(
      `${environment.baseUrl}/investments/id/${id}/status/${type}`,
      {}
    );
  }

  startProject(id: string) {
    return this.http.put(`${this.projectsUrl}/id/${id}/start`, {});
  }

  createReport(data: any, id: any) {
    return this.http.post(`${environment.baseUrl}/projects/id/${id}/reports`, data);
  }

  findProjectReportsById(id: string, pageNumber: number, size: number): Observable<any> {
    const page = pageNumber - 1;
    return this.http.get(`${this.projectsUrl}/id/${id}/reports?page=${page}&size=${size}`);
  }

  findProjectReportsByIdAndRange(id: string, pageNumber: number, size: number, startDate: string, endDate: string, locality: string): Observable<any> {
    const page = pageNumber - 1;
    return this.http.get(`${this.projectsUrl}/id/${id}/reports?page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}&locality=${locality}`);
  }

  getReportLink(id: string) {
    return this.http.get(`${this.projectsUrl}/id/${id}/reports/link`);
  }

  saveReportFromField(id: string, data: any) {
    return this.http.post(`${this.reportUrl}/${id}`, data);
  }

  postReportLink(id: string, data: any) {
    return this.http.post(`${this.reportUrl}/${id}`, data);
  }

  resetReport(projectId: any) {
    return this.http.delete(`${this.projectsUrl}/id/${projectId}/final`);
  }

  getParticipants(id: any) {
    return this.http.get(`${environment.baseUrl}/stats/project-participants/project/id/${id}`);
  }

  getLocalityStats(id: any) {
    return this.http.get(`${environment.baseUrl}/projects/id/${id}/reports/locality/stats`);
  }

  getDateStats(id: any) {
    return this.http.get(`${environment.baseUrl}/projects/id/${id}/reports/date/stats`);
  }

  doShareReport(data: any, id: any) {
    return this.http.post(`${environment.baseUrl}/projects/id/${id}/reports/link`, data);
  }

  getProjectReport(data: any) {
    return this.http.get(`${environment.baseUrl}/projects/id/${data.projectId}/reports/id/${data.reportId}`);
  }

  updateProjectReport(data: any, reportId: any, projectId: any) {
    return this.http.patch(`${environment.baseUrl}/projects/id/${projectId}/reports/id/${reportId}`, data);
  }

  approveProjectReport(data: any, projectId: any, reportId: any) {
    return this.http.put(`${environment.baseUrl}/projects/id/${projectId}/reports/${reportId}/approve`, data);
  }

  denyProjectReport(data: any, projectId: any, reportId: any) {
    return this.http.put(`${environment.baseUrl}/projects/id/${projectId}/reports/${reportId}/decline`, data);
  }

  getFinalReportList(id: any) {
    return this.http.get(`${environment.baseUrl}/projects/id/${id}/final`);
  }

  doSaveReport(id: any, data: any) {
    return this.http.post(`${environment.baseUrl}/projects/id/${id}/final`, data);
  }

  completeReport(id: any) {
    return this.http.put(`${environment.baseUrl}/projects/id/${id}/phase/reporting/completed`, id);
  }

  public setEditReport(data: any) {
    this.editReport = data;
  }

  public getEditReport() {
    return this.editReport;
  }

  public setContinueTo(_title: string) {
    this.continueTo.next(_title);
  }

  public setReportData(data: any) {
    if (data && data.from) {
      if (data.from === 'rep1') {
        this.reportsData.rep1 = data.data;
      } else if (data.from === 'rep2') {
        this.reportsData.rep2 = data.data;
      }
    }
  }

  public answerQuestionnaire(id: string, data: any) {
    return this.http.put(
      `${environment.baseUrl}/projects/id/${id}/questionnaire/status/completed`,
      ''
    );
  }

  public getReportData() {
    return this.reportsData;
  }

  public setProjectId(id: any) {
    this.projectId = id;
  }

  public getProjectId() {
    return this.projectId;
  }


  public saveMedia(data: any) {
    return this.http.post(`${environment.baseUrl}/media`, data);
  }
}
