import { Component, forwardRef } from '@angular/core';

import { TemplateComponent } from '../template-base.class';
import { NamePersonasTemplateData, TemplateParams } from '.';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-name_personas',
  templateUrl: './name_personas.component.html',
  styleUrls: ['./name_personas.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => NamePersonasTemplateComponent) }]
})
export class NamePersonasTemplateComponent extends TemplateComponent {
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
    this.buyerPersonasList$.pipe(take(1)).subscribe(personas => {
      this.inputIds = {
        personas: personas.map(persona => `persona_name_${persona.index}`)
      };
    });

    this.contentData = this.data.data.template_params_json as NamePersonasTemplateData['template_params_json'];
  }
}
