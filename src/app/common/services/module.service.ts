import { Injectable } from '@angular/core';
import { Module, Step, Input, Template, Organization, ModuleStatus } from '../interfaces/module.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, Subject } from 'rxjs';
import { shareReplay, switchMap, map, filter, debounceTime, distinctUntilChanged, share, take, tap } from 'rxjs/operators';

@Injectable()
export class ModuleService {

  baseUrl = '/api/modules';

  organizations$: Observable<Organization[]>;

  moduleChanged$ = new BehaviorSubject(true);

  constructor(private httpClient: HttpClient) { }

  private moduleCache = {};

  private modules: Observable<Module[]>;

  inputDebounce: {[key: number]: Subject<Input>} = {};
  inputObservable: {[key: number]: Observable<Input>} = {};

  getModuleConfig(id: number): Observable<Module> {
    if (!Number(id)) {
      throw throwError('Invalid ID');
    }

    if (!this.moduleCache[id]) {
      this.moduleCache[id] = this.httpClient.get<Module>(`${this.baseUrl}/${id}`).pipe(shareReplay(1));
    }

    return this.moduleCache[id];
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
    if (!this.modules) {
      this.modules = this.httpClient.get<Module[]>(this.baseUrl).pipe(shareReplay(1));
    }

    return this.modules;
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

  saveNotes(module: Partial<Module>, orgId: number, notes: string): Observable<ModuleStatus> {
    return this.httpClient.post<ModuleStatus>(`${this.baseUrl}/${module.id}/org/${orgId}/notes`, {notes});
  }

  saveAssignedTo(module: Partial<Module>, orgId: number, assigned_to: string): Observable<ModuleStatus> {
    return this.httpClient.post<ModuleStatus>(`${this.baseUrl}/${module.id}/org/${orgId}/assign`, {assigned_to});
  }

  saveInput(input: Input): Observable<any> {
    if (!input) {
      console.error('No input data provided');
      return;
    }

    console.log(input.id, !!this.inputDebounce[input.id]);

    if (!this.inputDebounce[input.id]) {
      this.inputDebounce[input.id] = new Subject();
      this.inputObservable[input.id] = this.inputDebounce[input.id].pipe(
        debounceTime(500),
        distinctUntilChanged((i, p) => i.id === p.id),
        switchMap(inp => {
          const dataToSend = (({ comments_json, content, id }) => ({ comments_json, content, id }))(inp);
          return this.httpClient.post<Input>(`${this.baseUrl}/${inp.module_id}/org/${inp.org_id}/input/${inp.id}`, dataToSend).pipe(
            tap(_ => {
              this.inputDebounce[input.id].complete();
              this.inputDebounce[input.id] = null;
              this.inputObservable[input.id] = null;
            })
          );
        }),
        shareReplay(1)
      );
    }

    setTimeout(_ => this.inputDebounce[input.id].next(input));

    return this.inputObservable[input.id];
  }

  saveMultipleInputs(inputs: Input[]): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/${inputs[0].module_id}/org/${inputs[0].org_id}/inputs`, inputs.map(
      input => (({ comments_json, content, id }) => ({ comments_json, content, id }))(input)
    ));
  }

  getOrganizations(): Observable<Organization[]> {
    if (!this.organizations$) {
      this.organizations$ = this.httpClient.get<Organization[]>(`${this.baseUrl}/organizations/list`).pipe(shareReplay(1));
    }

    return this.organizations$.pipe(filter(orgs => !!orgs));
  }

  getDefaultOrganization(): Observable<Organization> {
    return this.getOrganizations().pipe(map(orgs => orgs[0]));
  }

  exportUrl() {
    return `${this.baseUrl}/export`;
  }

  sync(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/sync`);
  }

  markAsDone(moduleId: number, orgId: number, stepId: number, is_checked: boolean = true): Observable<any> {
    return this.httpClient.post('/api/modules/' + moduleId + '/org/' + orgId + '/step/' + stepId + '/done', {is_checked});
  }

  markAsApproved(moduleId: number, orgId: number, stepId: number, is_approved: boolean = true): Observable<number[]> {
    return this.httpClient.post<number[]>('/api/modules/' + moduleId + '/org/' + orgId + '/step/' + stepId + '/done', {is_approved, org_id: orgId});
  }
}
