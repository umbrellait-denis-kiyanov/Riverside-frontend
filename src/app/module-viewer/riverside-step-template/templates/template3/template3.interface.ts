import { TemplateContentDataBase } from '../template.interface';

export interface Template3Data extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    title: string;
    instructions: string;
  };
}
