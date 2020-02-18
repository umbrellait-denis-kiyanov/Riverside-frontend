import { TemplateContentDataBase } from '../template.interface';

export class Item {
  id?: number;
  title: string;
  description: string;
  image: string;
}

export interface RadiobuttonTemplateData extends TemplateContentDataBase {
  template_params_json: {
    input_sufix: string;
    title: string;
    description: string;
    require_selection: boolean;
    step_select:
      | 'Title Only'
      | 'Title And Description'
      | 'Title Description And Image';
    options: Array<{ title: string; image: string; description: string }>;
  };
}
