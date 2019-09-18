import { Component } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';
import { GenericTemplateData } from './generic.interface';

@Component({
  selector: 'app-generic',
  templateUrl: './generic.component.html',
  styleUrls: ['./generic.component.sass']
})
export class GenericTemplateComponent extends TemplateComponent {
  contentData: GenericTemplateData['template_params_json'];

  protected init() {
    this.contentData = (this.data.data.template_params_json as GenericTemplateData['template_params_json']);
  }

  getDescription() {
    return '';
  }

  getName() {
    return 'Generic Content';
  }
}
