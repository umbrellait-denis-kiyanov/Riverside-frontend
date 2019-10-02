import { Injectable } from '@angular/core';
import { AssessmentGroup, AssessmentQuestion, AssessmentType } from '../interfaces/assessment.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organization } from '../interfaces/module.interface';

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

}
