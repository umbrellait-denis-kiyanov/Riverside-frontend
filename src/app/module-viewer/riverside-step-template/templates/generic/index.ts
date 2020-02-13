import { TemplateContentDataBase } from '../template.interface';

export interface GenericTemplateData extends TemplateContentDataBase {
/* template-def-start */
  template_params_json: {
    description: string;
    content: string;
    title: string;
  };
/* template-def-end */
}
