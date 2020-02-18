import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import ModuleContent from '../interfaces/module-content.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable()
export class ModuleContentService {
  baseUrl = environment.apiRoot + '/api/modules';

  constructor(private httpClient: HttpClient) {}

  load(
    moduleId: number,
    stepId: number,
    org_id: number
  ): Observable<ModuleContent> {
    return this.httpClient
      .get(`${this.baseUrl}/${moduleId}/org/${org_id}/step/${stepId}`, {
        observe: 'response'
      })
      .pipe(
        map((fullResponse: HttpResponse<any>) => {
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
              step_id: stepId
            };
          }

          return ModuleContent.fromObject(object);
        })
      );
  }
}
