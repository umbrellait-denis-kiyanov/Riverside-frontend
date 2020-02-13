import { Component, forwardRef } from '@angular/core';

import { TemplateComponent } from '../template-base.class';
import { PersonaBehaviorTemplateData } from '.';
import txt from '!!raw-loader!./index.ts';

@Component({
  selector: 'app-persona_behavior',
  templateUrl: './persona_behavior.component.html',
  styleUrls: ['./persona_behavior.component.sass'],
  preserveWhitespaces: true,
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => PersonaBehaviorTemplateComponent) }]
})

export class PersonaBehaviorTemplateComponent extends TemplateComponent {
  inputIds: {
    personas: string[]
  };
  params = txt;

  contentData: PersonaBehaviorTemplateData['template_params_json'];

  getDescription() {
    return '';
  }

  getName() {
    return 'Persona Behavior';
  }

  protected init() {
    this.contentData = this.data.data.template_params_json as PersonaBehaviorTemplateData['template_params_json'];

    const suffix = this.contentData.input_sufix ? '_' + this.contentData.input_sufix : '';

    this.inputIds = {
      personas: this.activePersonas.map(persona => persona.split('_').join('_behavior_') + suffix)
    };
  }
}
