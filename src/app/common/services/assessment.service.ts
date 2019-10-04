import { Injectable } from '@angular/core';
import { AssessmentGroup, AssessmentQuestion, AssessmentType, AssessmentOrgGroup } from '../interfaces/assessment.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AssessmentService {

  baseUrl = '/api/assessment';

  constructor(private httpClient: HttpClient) { }

  getTypes(): Observable<AssessmentType[]> {
    return this.httpClient.get<AssessmentType[]>(`${this.baseUrl}/types`);
  }

  getGroups(type: AssessmentType, orgID: number): Observable<AssessmentGroup[]> {
    return this.httpClient.get<AssessmentGroup[]>(`${this.baseUrl}/groups/${type.id}/org/${orgID}`);
  }

  getQuestions(group: AssessmentGroup, orgID: number): Observable<AssessmentQuestion[]> {
    return this.httpClient.get<AssessmentQuestion[]>(`${this.baseUrl}/questions/${group.id}/org/${orgID}`);
  }

  saveAnswer(question: AssessmentQuestion, orgID: number, answer: boolean): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/answer/${question.id}/org/${orgID}`, {answer});
  }

  saveNotes(question: AssessmentQuestion, orgID: number, notes: string): Observable<any> {
    return this.httpClient.post<AssessmentQuestion[]>(`${this.baseUrl}/note/${question.id}/org/${orgID}`, {notes});
  }

  getAnswers(group: AssessmentGroup, orgID: number): Observable<AssessmentOrgGroup> {
    return this.httpClient.get<AssessmentOrgGroup>(`${this.baseUrl}/answers/${group.id}/org/${orgID}`);
  }

  setImportance(group: AssessmentGroup, orgID: number, importance: number): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/importance/${group.id}/org/${orgID}`, {importance});
  }

  markAsDone(group: AssessmentGroup, orgID: number): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/done/${group.id}/org/${orgID}`, {});
  }

}
