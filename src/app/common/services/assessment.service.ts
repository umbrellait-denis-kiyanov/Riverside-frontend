import { Injectable } from '@angular/core';
import { AssessmentGroup, AssessmentQuestion, AssessmentType } from '../interfaces/assessment.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AssessmentService {

  baseUrl = '/api/assessment';

  constructor(private httpClient: HttpClient) { }

  getTypes(): Observable<AssessmentType[]> {
    return this.httpClient.get<AssessmentType[]>(`${this.baseUrl}/types`);
  }

  getGroups(type: AssessmentType): Observable<AssessmentGroup[]> {
    return this.httpClient.get<AssessmentGroup[]>(`${this.baseUrl}/groups/${type.id}`);
  }

  getQuestions(group: AssessmentGroup): Observable<AssessmentQuestion[]> {
    return this.httpClient.get<AssessmentQuestion[]>(`${this.baseUrl}/questions/${group.id}`);
  }

}
