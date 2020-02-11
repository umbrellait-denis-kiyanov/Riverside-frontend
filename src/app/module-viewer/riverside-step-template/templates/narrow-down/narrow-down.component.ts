import { Component, forwardRef } from '@angular/core';

import { TemplateComponent } from '../template-base.class';
import { NarrowDownData, TemplateParams } from '.';

@Component({
  selector: 'app-template2',
  templateUrl: './narrow-down.component.html',
  styleUrls: ['./narrow-down.component.sass'],
  providers: [
    {
      provide: TemplateComponent,
      useExisting: forwardRef(() => NarrowDownComponent)
    }
  ]
})
export class NarrowDownComponent extends TemplateComponent {
  params = TemplateParams;
  inputIds = {
    fromPreviousStep: ['brainstorm_personas'],
    personas: [
      'persona_1',
      'persona_2',
      'persona_3',
      'persona_4',
      'persona_5',
      'persona_6'
    ]
  };

  contentData: NarrowDownData['template_params_json'];

  getDescription() {
    return '';
  }

  getName() {
    return 'Narrow Down';
  }

  protected init() {
    this.contentData = this.data.data
      .template_params_json as NarrowDownData['template_params_json'];
  }
}
