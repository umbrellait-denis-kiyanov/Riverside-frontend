import { TemplateContentDataBase } from '../template.interface';

export interface NamePersonasTemplateData extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    resource: string;
    title: string;
  };
}

export const TemplateParams = `{
  description: string;
  resource: string;
  title: string;
}`;