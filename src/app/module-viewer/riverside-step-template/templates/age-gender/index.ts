import { TemplateContentDataBase } from '../template.interface';

export interface AgeGenderTemplateData extends TemplateContentDataBase {
/* template-def-start */
  template_params_json: {
    description: string;
    title: string;
    instructions?: string;
  };
/* template-def-end */
}
