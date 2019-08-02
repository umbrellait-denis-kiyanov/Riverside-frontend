import { TemplateContentDataBase } from '../template.interface';

export interface BrainstormTemplateData extends TemplateContentDataBase {
  template_params_json: {
    content: string;
    title: string;
  };
}
