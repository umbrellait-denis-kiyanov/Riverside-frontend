import { Component } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';
import { data } from './exampleData';
import { Template1Data } from './template1.interface';

@Component({
  selector: 'app-template1',
  templateUrl: './template1.component.html',
  styleUrls: ['./template1.component.sass']
})
export class Template1Component extends TemplateComponent {
  contentData: Template1Data['template_params_json'];

  protected init() {
    this.contentData = (this.data.data.template_params_json as Template1Data['template_params_json']);
  }
}
