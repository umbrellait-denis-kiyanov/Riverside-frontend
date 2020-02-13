import { TemplateContentDataBase } from '../template.interface';

export interface NarrowDownData extends TemplateContentDataBase {
/* template-def-start */
  template_params_json: {
    description: string;
    title: string;
  };
/* template-def-end */
}
