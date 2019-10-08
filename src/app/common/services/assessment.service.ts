import { Injectable } from '@angular/core';
import { AssessmentGroup, AssessmentQuestion, AssessmentType, AssessmentOrgGroup } from '../interfaces/assessment.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';

@Injectable()
export class AssessmentService {

  baseUrl = '/api/assessment';

  groupsUpdated$ = new BehaviorSubject<boolean>(false);

  updateGroups = tap(_ => this.groupsUpdated$.next(true));

  constructor(private httpClient: HttpClient) { }

  getTypes(): Observable<AssessmentType[]> {
    return this.httpClient.get<AssessmentType[]>(`${this.baseUrl}/types`).pipe(shareReplay(1));
  }

  getGroups(type: AssessmentType): Observable<AssessmentGroup[]> {
    return this.httpClient.get<AssessmentGroup[]>(`${this.baseUrl}/groups/${type.id}`).pipe(shareReplay(1));
  }

  getOrgGroups(type: AssessmentType, orgID: number): Observable<AssessmentOrgGroup[]> {
    return this.httpClient.get<AssessmentOrgGroup[]>(`${this.baseUrl}/org-groups/${type.id}/org/${orgID}`);
  }

  getQuestions(group: AssessmentGroup): Observable<AssessmentQuestion[]> {
    return this.httpClient.get<AssessmentQuestion[]>(`${this.baseUrl}/questions/${group.id}`).pipe(shareReplay(1));
  }

  saveAnswer(question: AssessmentQuestion, orgID: number, answer: boolean): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/answer/${question.id}/org/${orgID}`, {answer}).pipe(this.updateGroups);
  }

  saveNotes(question: AssessmentQuestion, orgID: number, notes: string): Observable<any> {
    return this.httpClient.post<AssessmentQuestion[]>(`${this.baseUrl}/note/${question.id}/org/${orgID}`, {notes});
  }

  getAnswers(group: AssessmentGroup, orgID: number): Observable<AssessmentOrgGroup> {
    return this.httpClient.get<AssessmentOrgGroup>(`${this.baseUrl}/answers/${group.id}/org/${orgID}`);
  }

  setImportance(group: AssessmentGroup, orgID: number, importance: number): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/importance/${group.id}/org/${orgID}`, {importance}).pipe(this.updateGroups);
  }

  markAsDone(group: AssessmentGroup, orgID: number): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/done/${group.id}/org/${orgID}`, {}).pipe(this.updateGroups);
  }

}
