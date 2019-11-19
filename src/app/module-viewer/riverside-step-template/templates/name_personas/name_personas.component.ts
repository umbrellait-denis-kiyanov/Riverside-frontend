import { Component, forwardRef } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';
import { NamePersonasTemplateData } from './name_personas.interface';

@Component({
  selector: 'app-name_personas',
  templateUrl: './name_personas.component.html',
  styleUrls: ['./name_personas.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => NamePersonasTemplateComponent) }]
})
export class NamePersonasTemplateComponent extends TemplateComponent {
  inputIds = {
    personas: [  ]
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

    Object.keys(this.inputIds).forEach(key => {
      this.inputIds[key].forEach(id => {
        this.inputs[id].content = this.inputs[id].content || '';
      });
    });
    this.contentData = this.data.data.template_params_json as NamePersonasTemplateData['template_params_json'];
  }
}
