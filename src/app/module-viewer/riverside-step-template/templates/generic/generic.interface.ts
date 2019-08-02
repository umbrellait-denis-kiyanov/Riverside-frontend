import { TemplateContentDataBase } from '../template.interface';

export interface GenericTemplateData extends TemplateContentDataBase {
  template_params_json: {
    content: string;
    title: string;
  };
}
