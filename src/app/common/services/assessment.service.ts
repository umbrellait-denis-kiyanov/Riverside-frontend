import { Injectable } from '@angular/core';
import { AssessmentGroup, AssessmentQuestion, AssessmentType,
         AssessmentOrgGroup, AssessmentSession, ModuleScores, PendingSessions } from '../interfaces/assessment.interface';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, shareReplay, map, take } from 'rxjs/operators';

@Injectable()
export class AssessmentService {

  baseUrl = '/api/assessment';

  groupsUpdated$ = new BehaviorSubject<number>(0);

  moveToNextGroup$ = new BehaviorSubject<boolean>(false);

  updateGroups = tap(_ => this.groupsUpdated$.next(Date.now()));

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

  getModuleScores(orgId: number): Observable<ModuleScores> {
    return this.httpClient.get<ModuleScores>(`${this.baseUrl}/module/org/${orgId}`);
  }

  getGroups(type: AssessmentType): Observable<AssessmentGroup[]> {
    return new BehaviorSubject<AssessmentGroup[]>(type.groups);
  }

  getQuestions(group: AssessmentGroup): Observable<AssessmentQuestion[]> {
    return new BehaviorSubject<AssessmentQuestion[]>(group.questions);
  }

  getSession(type: AssessmentType, orgID: number): Observable<HttpResponse<AssessmentSession>> {
    return this.httpClient.get<AssessmentSession>(`${this.baseUrl}/session/${type.id}/org/${orgID}`, {observe: 'response'});
  }

  finishSession(session: AssessmentSession): Observable<any> {
    return this.httpClient.post<any>(`${this.baseUrl}/finish-session/${session.id}/org/${session.org_id}`, {});
  }

  getOrgGroups(type: AssessmentType, orgID: number): Observable<AssessmentOrgGroup[]> {
    return this.httpClient.get<AssessmentOrgGroup[]>(`${this.baseUrl}/org-groups/${type.id}/org/${orgID}`);
  }

  saveAnswer(question: AssessmentQuestion, type: AssessmentType, orgID: number, answer: boolean | null): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/answer/${question.id}/type/${type.id}/org/${orgID}`, {answer}).pipe(this.updateGroups);
  }

  answerAll(group: AssessmentGroup, type: AssessmentType, orgID: number, answer: boolean): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/answer-all/${group.id}/type/${type.id}/org/${orgID}`, {answer}).pipe(this.updateGroups);
  }

  clearAll(group: AssessmentGroup, type: AssessmentType, orgID: number): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/answer-all/${group.id}/type/${type.id}/org/${orgID}`, {answer: null}).pipe(this.updateGroups);
  }

  saveNotes(question: AssessmentQuestion, type: AssessmentType, orgID: number, notes: string): Observable<any> {
    return this.httpClient.post<AssessmentQuestion[]>(`${this.baseUrl}/note/${question.id}/type/${type.id}/org/${orgID}`, {notes});
  }

  getAnswers(group: AssessmentGroup, type: AssessmentType, orgID: number): Observable<HttpResponse<AssessmentOrgGroup>> {
    return this.httpClient.get<AssessmentOrgGroup>(`${this.baseUrl}/answers/${group.id}/type/${type.id}/org/${orgID}`,
                                                    {observe: 'response'});
  }

  setImportance(group: AssessmentGroup, type: AssessmentType, orgID: number, importance: number): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/importance/${group.id}/type/${type.id}/org/${orgID}`, {importance})
                          .pipe(this.updateGroups);
  }

  getSessionsPendingApproval(): Observable<PendingSessions> {
    return this.httpClient.get<PendingSessions>(`${this.baseUrl}/pending-sessions`).pipe(shareReplay(1));
  }

  markAsDone(group: AssessmentGroup, type: AssessmentType, orgID: number): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/done/${group.id}/type/${type.id}/org/${orgID}`, {})
      .pipe(
        this.updateGroups,
        tap(_ => this.moveToNextGroup$.next(true))
      );
  }

  getCompletedSessions(type: AssessmentType, orgID: number): Observable<AssessmentSession[]> {
    return this.httpClient.get<AssessmentSession[]>(`${this.baseUrl}/completed-sessions/${type.id}/org/${orgID}`);
  }
}
