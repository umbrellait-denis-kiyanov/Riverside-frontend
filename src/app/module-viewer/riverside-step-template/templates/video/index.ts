import { TemplateContentDataBase } from '../template.interface';

export interface VideoTemplateData extends TemplateContentDataBase {
/* template-def-start */
  template_params_json: {
    description: string;
    videoUrl: string;
    content: string;
    title: string;
  };
/* template-def-end */
}
