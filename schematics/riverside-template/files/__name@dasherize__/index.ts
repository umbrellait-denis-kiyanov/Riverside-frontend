import { TemplateContentDataBase } from '../template.interface';

export interface <%= classify(name) %>TemplateData extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    title: string;
  };
}

export const TemplateParams = `{
 description: string;
 title: string;
}`;
