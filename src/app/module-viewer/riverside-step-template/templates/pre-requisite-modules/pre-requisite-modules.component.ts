import { Component, forwardRef } from '@angular/core';
import { TemplateComponent } from '../template-base.class';
import { PreRequisiteModuleTemplateData, TemplateParams } from '.';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Module } from 'src/app/common/interfaces/module.interface';

@Component({
  selector: 'app-pre-requisite-modules',
  templateUrl: './pre-requisite-modules.component.html',
  styleUrls: ['./pre-requisite-modules.component.sass'],
  providers: [
    {
      provide: TemplateComponent,
      useExisting: forwardRef(() => PreRequisiteModulesComponent)
    }
  ]
})
export class PreRequisiteModulesComponent extends TemplateComponent {
  params = TemplateParams;
  contentData: PreRequisiteModuleTemplateData['template_params_json'];

  modules$: Observable<Module[]>;

  hasError = false;

  init() {
    this.contentData = this.data.data
      .template_params_json as PreRequisiteModuleTemplateData['template_params_json'];

    const moduleIDs = this.contentData.modules.map(module =>
      Number(module.module)
    );

    this.modules$ = this.navService.organization$.pipe(
      switchMap(orgId =>
        this.moduleService
          .getCategories(orgId)
          .pipe(
            map(categories =>
              categories.body.reduce(
                (res, category) =>
                  res.concat(
                    category.modules.filter(module =>
                      moduleIDs.includes(module.id)
                    )
                  ),
                []
              )
            )
          )
      )
    );
  }

  getDescription() {
    return 'Require completion of certain modules before allowing access to the next module';
  }

  getName() {
    return 'Pre-requisite Modules';
  }

  hasInputs() {
    return false;
  }

  validate() {
    this.hasError = false;

    return this.modules$.pipe(
      map(modules =>
        modules.every(module => module.status && module.status.progress === 100)
      ),
      tap(isValid => (this.hasError = !isValid))
    );
  }
}
