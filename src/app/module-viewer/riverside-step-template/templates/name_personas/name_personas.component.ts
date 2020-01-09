import { Component, forwardRef } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';
import { NamePersonasTemplateData } from '.';

@Component({
  selector: 'app-name_personas',
  templateUrl: './name_personas.component.html',
  styleUrls: ['./name_personas.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => NamePersonasTemplateComponent) }]
})
export class NamePersonasTemplateComponent extends TemplateComponent {
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
    this.inputIds = {
      personas: this.activePersonas.map(persona => persona.split('_').join('_name_'))
    };

    this.contentData = this.data.data.template_params_json as NamePersonasTemplateData['template_params_json'];
  }
}
