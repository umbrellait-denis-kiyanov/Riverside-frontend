import { Component, forwardRef } from '@angular/core';
import { TemplateComponent } from '../template-base.class';
import { ContentMapTemplateData } from '.';
import txt from '!!raw-loader!./index.ts';

declare interface ContentMapInputData {
  hasData: boolean;
}

@Component({
  selector: 'content-map',
  templateUrl: 'content-map.component.html',
  styleUrls: ['./content-map.component.sass'],
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => ContentMapComponent) }]
})
export class ContentMapComponent extends TemplateComponent {
  params = txt;

  contentData: ContentMapTemplateData['template_params_json'];

  getDescription() {
    return 'Content map description';
  }

  getName() {
    return 'Content Map';
  }

  get input() {
    return this.getInput('content_map');
  }

  set contentMapInputData(contentMapInputData: ContentMapInputData) {
    this.input.content = JSON.stringify(contentMapInputData);
    this.contentChanged(this.input);
  }

  get contentMapInputData() {
    return JSON.parse(this.input.getValue() || '{}') as ContentMapInputData;
  }
}
