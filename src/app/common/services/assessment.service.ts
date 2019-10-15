import { Injectable } from '@angular/core';
import { AssessmentGroup, AssessmentQuestion, AssessmentType, AssessmentOrgGroup, AssessmentSession } from '../interfaces/assessment.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, shareReplay, map, take } from 'rxjs/operators';

@Injectable()
export class AssessmentService {

  baseUrl = '/api/assessment';

  groupsUpdated$ = new BehaviorSubject<boolean>(false);

  updateGroups = tap(_ => this.groupsUpdated$.next(true));

  types$: Observable<AssessmentType[]>;

  activeTypes$: Observable<AssessmentType[]>;

  constructor(private httpClient: HttpClient) { }

  getTypes(): Observable<AssessmentType[]> {
    if (!this.types$) {
      this.types$ = this.httpClient.get<AssessmentType[]>(`${this.baseUrl}/questions`).pipe(shareReplay(1));
    }

    return this.types$;
  }

  getType(id: number): Observable<AssessmentType> {
    return this.getTypes().pipe(
      map(t => t.filter(tp => tp.id == id)),
      map(t => t[0]),
      take(1)
    );
  }

  getGroups(type: AssessmentType): Observable<AssessmentGroup[]> {
    return new BehaviorSubject<AssessmentGroup[]>(type.groups);
  }

  getQuestions(group: AssessmentGroup): Observable<AssessmentQuestion[]> {
    return new BehaviorSubject<AssessmentQuestion[]>(group.questions);
  }

  getSession(type: AssessmentType, orgID: number): Observable<AssessmentSession> {
    return this.httpClient.get<AssessmentSession>(`${this.baseUrl}/session/${type.id}/org/${orgID}`);
  }

  finishSession(session: AssessmentSession): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/finish-session/${session.id}/org/${session.org_id}`, {});
  }

  getOrgGroups(type: AssessmentType, orgID: number): Observable<AssessmentOrgGroup[]> {
    return this.httpClient.get<AssessmentOrgGroup[]>(`${this.baseUrl}/org-groups/${type.id}/org/${orgID}`);
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

  getCompletedSessions(type: AssessmentType, orgID: number): Observable<AssessmentSession[]> {
    return this.httpClient.get<AssessmentSession[]>(`${this.baseUrl}/completed-sessions/${type.id}/org/${orgID}`);
  }


}
