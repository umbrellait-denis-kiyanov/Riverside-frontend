import { TemplateContentDataBase } from '../template.interface';

export interface NamePersonasTemplateData extends TemplateContentDataBase {
/* template-def-start */
  template_params_json: {
    description: string;
    resource: string;
    title: string;
  };
/* template-def-end */
}
