import { Component, forwardRef } from '@angular/core';

import { TemplateComponent } from '../template-base.class';
import { NamePersonasTemplateData, TemplateParams } from '.';
import BuyerPersonasConfigTemplateComponent from '../buyer-personas-config-template-component';

@Component({
  selector: 'app-name_personas',
  templateUrl: './name_personas.component.html',
  styleUrls: ['./name_personas.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => NamePersonasTemplateComponent) }]
})
export class NamePersonasTemplateComponent extends BuyerPersonasConfigTemplateComponent {
  params = TemplateParams;
  inputIds: {
    personas: string[]
  };

  contentData: NamePersonasTemplateData['template_params_json'];

  getDescription() {
    return '';
  }

  getName() {
    return 'Name Personas';
  }

  protected init() {
    const personas = Object.values(this.inputs)
        .filter(i => i)
        .map(input => { return input.element_key &&
          input.element_key.match(/^persona_[0-9]+$/) &&
          this.notEmpty(input.content) ?
          input.element_key : null;
        }).filter(i => i);

    this.inputIds = {
      personas: personas.map(persona => persona.split('_').join('_name_'))
    };

    this.contentData = this.data.data.template_params_json as NamePersonasTemplateData['template_params_json'];
  }
}
