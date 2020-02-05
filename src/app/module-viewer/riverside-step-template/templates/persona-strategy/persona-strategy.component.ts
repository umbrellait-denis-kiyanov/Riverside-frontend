import { Component, forwardRef } from '@angular/core';
import { TemplateComponent } from '../template-base.class';
import { PersonaStrategyTemplateData, TemplateParams } from '.';

@Component({
  selector: 'app-persona-strategy',
  templateUrl: './persona-strategy.component.html',
  styleUrls: ['./persona-strategy.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => PersonaStrategyComponent) }]
})
export class PersonaStrategyComponent extends TemplateComponent {
  params = TemplateParams;
  contentData: PersonaStrategyTemplateData['template_params_json'];

  getDescription() {
    return 'Buyer Persona strategy';
  }

  getName() {
    return 'Persona Strategy';
  }

  hasInputs() {
    return true;
  }
}
