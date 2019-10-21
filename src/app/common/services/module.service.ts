import { Injectable } from '@angular/core';
import { Module, Step, Input, Template, Organization } from '../interfaces/module.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { shareReplay, switchMap, map, filter } from 'rxjs/operators';

@Injectable()
export class ModuleService {

  modules: Module[];
  baseUrl = '/api/modules';

  organizations$: Observable<Organization[]>;

  moduleChanged$ = new BehaviorSubject(true);

  constructor(private httpClient: HttpClient) { }

  getModuleConfig(id: number): Observable<Module> {
    if (!Number(id)) {
      throw throwError('Invalid ID');
    }

    return this.httpClient.get<Module>(`${this.baseUrl}/${id}`);
  }

  getOrgModule(id: number, org_id: number): Observable<Module> {
    const endpoint = String(id) + `/org/${org_id}`;
    return this.httpClient.get<Module>(`${this.baseUrl}/${endpoint}`).pipe(
      map(res => {
        let i = 1;
        for (const step of (res.steps as Step[])) {
          step.position = i;
          if (!step.is_section_break) {
            i++;
          }
        }

        return res;
      })
    );
  }

  reloadModule() {
    this.moduleChanged$.next(true);
  }

  getModules(): Observable<Module[]> {
    return this.httpClient.get<Module[]>(this.baseUrl).pipe(shareReplay(1));
  }

  getDefaultModule(): Observable<Module> {
    return this.getModules().pipe(
      switchMap(modules => this.getModuleConfig(modules[0].id))
    );
  }

  getTemplates(moduleId: number): Observable<Template[]> {
    return this.httpClient.get<Template[]>(`${this.baseUrl}/${moduleId}/templates`);
  }

  saveModule(module: Module): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/${module.id}`, module);
  }

  feedbackStarted(module: Partial<Module> & {orgId?: number}): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/${module.id}/feedback/start`, module);
  }

  getCategories(orgId: number): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/categories/org/${orgId}`, {observe: 'response'});
  }

  setStatus(module: Partial<Module>, isActivated: boolean, orgId: number): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/${module.id}/org/${orgId}/` + (isActivated ? 'activate' : 'deactivate'), {});
  }

  setDueDate(module: Partial<Module>, date: string, orgId: number): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/${module.id}/org/${orgId}/due-date`, {date});
  }

  saveNotes(module: Partial<Module>, orgId: number, notes: string): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/${module.id}/org/${orgId}/notes`, {notes});
  }

  saveInput(input: Input): Observable<any> {
    if (!input) {
      console.error('No input data provided');
      return;
    }

    const dataToSend =  (({ comments_json, content, element_key }) => ({ comments_json, content, element_key }))(input);
    return this.httpClient.post(`${this.baseUrl}/${input.module_id}/org/${input.org_id}/input/${input.id}`, dataToSend);
  }

  getOrganizations(): Observable<Organization[]> {
    if (!this.organizations$) {
      this.organizations$ = this.httpClient.get<Organization[]>(`${this.baseUrl}/organizations/list`).pipe(shareReplay(1));
    }

    return this.organizations$.pipe(filter(orgs => !!orgs));
  }

  exportUrl() {
    return `${this.baseUrl}/export`;
  }

  sync(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/sync`);
  }

  updateProgress(module: Module) {
    const numerator = module.steps.filter(s => !s.is_section_break).map(s => Number(!!s.is_approved)).reduce((prev, curr) => prev + curr);
    const denominator = module.steps.filter(s => !s.is_section_break).length;
    module.percComplete = Math.round(100 * numerator / denominator);
  }

  markAsDone(moduleId: number, orgId: number, stepId: number, is_checked: boolean = true): Observable<any> {
    return this.httpClient.post('/api/modules/' + moduleId + '/org/' + orgId + '/step/' + stepId + '/done', {is_checked});
  }

  markAsApproved(moduleId: number, orgId: number, stepId: number, is_approved: boolean = true): Observable<number[]> {
    return this.httpClient.post<number[]>('/api/modules/' + moduleId + '/org/' + orgId + '/step/' + stepId + '/done', {is_approved, org_id: orgId});
  }
}
