import { Component, forwardRef } from '@angular/core';
import { ModuleResultTemplateData } from '.';
import { TemplateComponent } from '../template-base.class';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TemplateContentData } from '../template-data.class';

@Component({
  selector: 'app-module-result',
  templateUrl: './module-result.component.html',
  styleUrls: ['./module-result.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => ModuleResultComponent) }],
})
export class ModuleResultComponent extends TemplateComponent {

  contentData: ModuleResultTemplateData['template_params_json'];

  moduleResultContent$: Observable<TemplateContentData>;

  init() {
    this.contentData = this.data.data.template_params_json as ModuleResultTemplateData['template_params_json'];

    const moduleID = Number(this.contentData.module);

    this.moduleResultContent$ = this.navService.organization$.pipe(switchMap(orgId =>
      this.moduleService.getOrgModule(moduleID, orgId).pipe(switchMap(module =>
        this.moduleContentService.load(moduleID, module.steps[module.steps.length - 1].id, orgId).pipe(map(content =>
          new TemplateContentData({data: content, me: this.me, canModify: false})
        ))
      ))
    ));
  }

  getDescription() {
    return 'Show a summary / result from another module';
  }

  getName() {
    return 'Previous Module Result';
  }

  hasInputs() {
    return false;
  }
}