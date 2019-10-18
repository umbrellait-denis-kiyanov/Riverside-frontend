import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import ModuleContent from '../interfaces/module-content.model';
import { BehaviorSubject } from 'rxjs';
import { ResourceFromServer } from './resource.class';


@Injectable()
export class ModuleContentService {

  baseUrl = '/api/modules';
  moduleContent = new ResourceFromServer<ModuleContent>();
  contentChanged = new BehaviorSubject<number>(0);

  constructor(private httpClient: HttpClient) { }

  async save(moduleContent: ModuleContent): Promise<any> {
    return this.moduleContent.save(
      this.httpClient.post(`${this.baseUrl}/${moduleContent.module_id}/org/${moduleContent.org_id}/step/${moduleContent.step_id}`, moduleContent).toPromise()
    );
  }

  load({ moduleId, stepId, org_id }) {
    return this.moduleContent.load(
      this.httpClient.get(`${this.baseUrl}/${moduleId}/org/${org_id}/step/${stepId}`, {observe: 'response'})
        .toPromise()
        .then(async (fullResponse: HttpResponse<any>) => {
          const res = fullResponse.body;
          let object;
          if (res.content) {
            object = Object.assign(res.content, {
              template_params_json: res.template_params_json,
              template_component: res.template_component,
              can_modify: Boolean(fullResponse.headers.get('X-Can-Modify'))
            });
          } else {
            object = {
              module_id: moduleId,
              step_id: stepId,
            };
          }
          return ModuleContent.fromObject(object);
        })
    );
  }
}
