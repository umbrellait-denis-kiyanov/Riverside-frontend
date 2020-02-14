import { TemplateContentDataBase } from '../template.interface';

export interface ContentMapTemplateData extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    typeOfMap_select: '1_simple_map' | '2_buyer_personas';
    title: string;
    inputs: string;
  };
}
