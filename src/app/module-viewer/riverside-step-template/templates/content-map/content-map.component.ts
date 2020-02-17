import { Component, forwardRef } from '@angular/core';
import { TemplateComponent } from '../template-base.class';
import { ContentMapTemplateData } from '.';
import txt from '!!raw-loader!./index.ts';
import { BrainstormTemplateData } from '../brainstorm';
import { BuyerPersona } from "../../../../common/interfaces/buyer-persona.interface";
import { Observable } from "rxjs";

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
  type: string;
  contentData: ContentMapTemplateData['template_params_json'];
  buyerPersonasList$: Observable<BuyerPersona[]>;

  contentMap: object = {
    '1_simple_map': [
      {
            title: 'where',
            description: 'Where will you get your content?'
      },
      {
            title: 'who',
            description: 'Who in your company can write the content?'
      },
      {
            title: 'what',
            description: 'What will you ask of your customers in exchange for the content?'
      }
      ],
    '2_buyer_personas': [
      {
        title: 'notInMarket',
        description: 'Not in market'
      },
      {
        title: 'recognizesNeed',
        description: 'Recognize sNeed'
      },
      {
        title: 'definesNeed',
        description: 'defines need'
      },
      {
        title: 'evaluatesOption',
        description: 'Evaluates Option'
      },
      {
        title: 'mitigatesRisk',
        description: 'Mitigates Risk'
      },
      {
        title: 'selectsSolution',
        description: 'Selects Solution'
      },
    ]
    };

  getDescription() {
    return 'Content map description';
  }

  getName() {
    return 'Content Map';
  }

  get input() {
    return this.getInput('content_map');
  }

  typeIsSimple(): boolean {
    return this.type === '1_simple_map';
  }

  getRowCount(): number {
    return this.contentData.number_of_inputs;
  }

  protected init() {
    // @ts-ignore - template_params_json.inputs property causes error with TypeScript 3.1
    this.contentData = this.data.data.template_params_json as ContentMapTemplateData['template_params_json'];
    this.buyerPersonasList$ = this.buyerPersonasService.getBuyerPersonas();
  }
}
