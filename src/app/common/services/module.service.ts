import { Injectable } from '@angular/core';
import { Module, Step } from '../interfaces/module.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoadModuleParams {
  orgId?: string;
}

@Injectable()
export class ModuleService {

  modules: Module[];
  selectedModule: number = null;
  baseUrl = '/api/modules';

  constructor(private httpClient: HttpClient) { }

  async selectModule(id: number): Promise<Module> {
    this.selectedModule = id;
    const m = await this.getModule(id);
    if (m) {
      return m;
    }
  }

  async getModule(id: number, org_id?: string): Promise<Module | false> {
    if (this.modules) {
      return this.modules.find(m => Number(m.id) === Number(id));
    } else {
      const endpoint = String(id) + (org_id ? `/org/${org_id}` : '');
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

  getOrganizations(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/organizations/list`);
  }

  exportUrl() {
    return `${this.baseUrl}/export`;
  }

  sync(): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/sync`);
  }
}
