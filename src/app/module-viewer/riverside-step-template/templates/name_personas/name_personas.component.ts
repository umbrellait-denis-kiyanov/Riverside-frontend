import { Component } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';
import { data } from './exampleData';
import { NamePersonasTemplateData } from './name_personas.interface';

@Component({
  selector: 'app-name_personas',
  templateUrl: './name_personas.component.html',
  styleUrls: ['./name_personas.component.sass']
})
export class NamePersonasTemplateComponent extends TemplateComponent {
  inputIds = {
    fromPreviousStep: [ ],
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
      fromPreviousStep: this.activePersonas,
      personas: this.activePersonas.map(persona => persona.split('_').join('_name_'))
    };

    Object.keys(this.inputIds).forEach(key => {
      this.inputIds[key].forEach(id => {
        this.inputs[id] = this.inputs[id] || '';
      });
    });
    this.contentData = this.data.data.template_params_json as NamePersonasTemplateData['template_params_json'];
  }
}
