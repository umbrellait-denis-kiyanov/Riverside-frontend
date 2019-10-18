import { Component } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';
import { PersonaBehaviorTemplateData } from './persona_behavior.interface';

@Component({
  selector: 'app-persona_behavior',
  templateUrl: './persona_behavior.component.html',
  styleUrls: ['./persona_behavior.component.sass'],
  preserveWhitespaces: true
})

export class PersonaBehaviorTemplateComponent extends TemplateComponent {
  inputIds = {
    personas: []
  };

  contentData: PersonaBehaviorTemplateData['template_params_json'];

  getDescription() {
    return '';
  }

  getName() {
    return 'Persona Behavior';
  }

  protected init() {
    this.inputIds = {
      personas: this.activePersonas.map(persona => persona.split('_').join('_behavior_'))
    };

    this.contentData = this.data.data.template_params_json as PersonaBehaviorTemplateData['template_params_json'];

    const defaultContent = { content: this.contentData.formatAsList ? this.defaultListContent : '<p></p>' };
    const sufix = this.contentData.input_sufix || '';
    Object.keys(this.inputIds).forEach(key => {
      this.inputIds[key].forEach((id, i) => {
        if (typeof id === 'string') {
          id = id + '_' + sufix;
          this.inputIds[key][i] = id;
          this.inputs[id] = this.inputs[id] || {...defaultContent};
        } else {
          Object.values(id).forEach((id2: string) => {
            this.inputs[id2] = this.inputs[id2] || {...defaultContent};
          });
        }
      });
    });

    console.log(this.inputs);
  }
}
