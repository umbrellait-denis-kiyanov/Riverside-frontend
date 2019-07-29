import { Injectable } from '@angular/core';
import { Module } from '../interfaces/module.interface';
import { HttpClient } from '@angular/common/http';

export interface LoadModuleParams {
  orgId?: string;
}

@Injectable()
export class ModuleService {

  modules: Module[];
  selectedModule: number = null;
  module: Module;
  baseUrl = '/api/modules';

  constructor(private httpClient: HttpClient) { }

  async selectModule(id: number): Promise<Module> {
    this.selectedModule = id;
    const m = await this.getModule(id);
    if (m) {
      return m;
    }
  }

  async getModule(id: number): Promise<Module | false> {
    if (this.modules) {
      return this.modules.find(m => Number(m.id) === Number(id));
    } else {
      return await this.httpClient.get(`${this.baseUrl}/${id}`).toPromise().then(async (res: any) => {
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

  updateProgress(module: Module) {
    const numerator = module.steps.map(s => Number(!!s.isChecked)).reduce((prev, curr) => prev + curr);
    const denominator = module.steps.length;
    module.percComplete = Math.round(100 * numerator / denominator);
  }
}
