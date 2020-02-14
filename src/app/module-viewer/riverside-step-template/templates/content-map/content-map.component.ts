import { Component, forwardRef } from '@angular/core';
import { TemplateComponent } from '../template-base.class';
import { ContentMapTemplateData } from '.';
import txt from '!!raw-loader!./index.ts';
import { BrainstormTemplateData } from "../brainstorm";

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
  inputState: number;
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

  protected init() {
    // @ts-ignore - template_params_json.inputs property causes error with TypeScript 3.1
    this.contentData = this.data.data.template_params_json as ContentMapTemplateData['template_params_json'];

    this.inputState = Number(this.contentData.typeOfMap_select.substr(0, 1));
    this.buyerPersonasList$ = this.buyerPersonasService.getBuyerPersonas();
  }

  set contentMapInputData(contentMapInputData: ContentMapInputData) {
    this.input.content = JSON.stringify(contentMapInputData);
    this.contentChanged(this.input);
  }

  get contentMapInputData() {
    return JSON.parse(this.input.getValue() || '{}') as ContentMapInputData;
  }
}
