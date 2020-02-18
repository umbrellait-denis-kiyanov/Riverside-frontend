import { TemplateContentDataBase } from '../template.interface';

export interface NarrowDownData extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    instructions: string;
    title: string;
  };
}
