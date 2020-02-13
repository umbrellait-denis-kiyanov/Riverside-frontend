import { TemplateContentDataBase } from '../template.interface';

export interface FeedbackSectionTemplateData extends TemplateContentDataBase {
/* template-def-start */
  template_params_json: {
    description: string;
    title: string;
    instructions: string;
    steps: Array<{
      sufix: string,
      title: string;
    }>
  };
/* template-def-end */
}
