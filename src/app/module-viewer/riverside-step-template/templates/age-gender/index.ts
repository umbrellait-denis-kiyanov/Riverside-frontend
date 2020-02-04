import { TemplateContentDataBase } from '../template.interface';

export interface AgeGenderTemplateData extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    title: string;
    instructions?: string;
  };
}

export const TemplateParams = `{
  description: string;
  title: string;
  instructions?: string;
}`;