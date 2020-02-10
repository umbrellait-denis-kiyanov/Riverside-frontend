import { TemplateContentDataBase } from '../template.interface';

export interface GenericTemplateData extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    content: string;
    title: string;
  };
}

export const TemplateParams = `{
  description: string;
  content: string;
  title: string;
}`;
