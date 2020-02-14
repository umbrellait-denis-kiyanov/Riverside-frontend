import { TemplateContentDataBase } from '../template.interface';

export interface ContentMapTemplateData extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    typeOfMap_select: 'simple_map' | 'buyer_personas';
    title: string;
    inputs: string;
  };
}
