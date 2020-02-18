import { TemplateContentDataBase } from '../template.interface';

export class Item {
  id: number;
  title: string;
  description: string;
  checked = false;
}

export interface CheckboxSelectorTemplateData extends TemplateContentDataBase {
  template_params_json: {
    title: string;
    input_sufix: string;
    align_right: boolean;
    show_descriptions: boolean;
    description: string;
    minimum_of_required_selections: number;
    maximum_of_required_selections: number;
    options: Array<{
      title: string;
      id: number;
      description: string;
      checked: boolean;
    }>;
  };
}
