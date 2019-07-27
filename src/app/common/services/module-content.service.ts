import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import ModuleContent from '../interfaces/module-content.model';
import { BehaviorSubject } from 'rxjs';

class ResourceFromServer<T> {
  data: T;
  loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  saving: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  ready: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  error: string = '';

  load(loadPromise: Promise<any>) {
    return this._request(loadPromise, 'loading').then(async (res: any) => {
      this.data = res;
      !!this.data && this.ready.next(true);
      return res;
    });
  }

  save(loadPromise: Promise<any>) {
    return this._request(loadPromise, 'saving');
  }

  private _request(loadPromise: Promise<any>, loadKey: 'saving' | 'loading') {
    this[loadKey].next(true);
    return loadPromise
      .then(async res => {
        this.error = '';
        return res;
      })
      .catch((e: Error) => {
        this.error = e.message;
      })
      .finally(() => {
        this[loadKey].next(true);
      });
  }
}

@Injectable()
export class ModuleContentService {

  baseUrl = '/api/modules';
  moduleContent = new ResourceFromServer<ModuleContent>();

  constructor(private httpClient: HttpClient) { }

  async save(moduleContent: ModuleContent): Promise<any> {
    return this.moduleContent.save(
      this.httpClient.post(`${this.baseUrl}/${moduleContent.module_id}/step/${moduleContent.step_id}`, moduleContent).toPromise()
    );
  }

  load({ moduleId, stepId, org_id }) {
    return this.moduleContent.load(
      this.httpClient.get(`${this.baseUrl}/${moduleId}/step/${stepId}`, { params: { org_id } })
        .toPromise()
        .then(async (res: any) => ModuleContent.fromObject(res.content || {
          module_id: moduleId,
          step_id: stepId,
          template_id: res.template_id
        }))
    );
  }
}
