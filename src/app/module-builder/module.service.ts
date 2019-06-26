import { Injectable } from '@angular/core';
import { Module } from './module-editor/module.interface';
import { HttpClient } from '@angular/common/http';

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

  async getModule(id: number): Promise<Module | false> {
    if (this.modules) {
      return this.modules.find(m => Number(m.id) === id);
    } else {
      return false;
    }
  }

  async loadModules(params?: LoadModuleParams, refresh = false) {
    if (this.modules && ! refresh) {
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
}
