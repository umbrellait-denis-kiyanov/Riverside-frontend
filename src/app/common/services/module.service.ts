import { Injectable } from '@angular/core';
import { Module, Step, Input, Organization } from '../interfaces/module.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface LoadModuleParams {
  orgId?: string;
}

@Injectable()
export class ModuleService {

  modules: Module[];
  baseUrl = '/api/modules';

  organizations$ = new BehaviorSubject<Organization[]>(null);

  constructor(private httpClient: HttpClient) { }

  getModuleConfig(id: number): Observable<Module> {
    return this.httpClient.get<Module>(`${this.baseUrl}/${id}`);
  }

  async getModule(id: number, org_id: number): Promise<Module | false> {
    const endpoint = String(id) + `/org/${org_id}`;
    return await this.httpClient.get(`${this.baseUrl}/${endpoint}`).toPromise().then(async (res: any) => {
      let i = 1;
      for (const step of (res.steps as Step[])) {
        step.position = i;
        if (!step.is_section_break) {
          i++;
        }
      }

      return res;
    });
  }

  async loadModules(params?: LoadModuleParams, refresh = false) {
    if (this.modules && !refresh) {
      return this.modules;
    }
    this.modules = await this.httpClient.get(this.baseUrl).toPromise().then(async (res: any) => {
      return res;
    });
    return this.modules;
  }

  getTemplates(moduleId: number) {
    return this.httpClient.get(`${this.baseUrl}/${moduleId}/templates`).toPromise();
  }

  async saveModule(module: Module): Promise<object> {
    return this.httpClient.post(`${this.baseUrl}/${module.id}`, module).toPromise();
  }

  async requestFeedback(module: Partial<Module>): Promise<object> {
    return this.httpClient.post(`${this.baseUrl}/${module.id}/feedback`, module).toPromise();
  }

  async feedbackStarted(module: Partial<Module> & {orgId?: number}): Promise<object> {
    return this.httpClient.post(`${this.baseUrl}/${module.id}/feedback/start`, module).toPromise();
  }

  async finalizeFeedback(module: Partial<Module> & {orgId?: number}): Promise<object> {
    return this.httpClient.post(`${this.baseUrl}/${module.id}/feedback/finish`, module).toPromise();
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
    if (!this.organizations$.value) {
      this.httpClient.get<Organization[]>(`${this.baseUrl}/organizations/list`).subscribe(organizations => {
        this.organizations$.next(organizations);
      });
    }

    return this.organizations$.pipe(filter(orgs => !!orgs));
  }

  exportUrl() {
    return `${this.baseUrl}/export`;
  }

  sync(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/sync`);
  }
}
