import { TemplateContentDataBase } from '../template.interface';

export interface FinalFeedbackTemplateData extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    title: string;
    instructions: string;
    steps: Array<{
      sufix: string;
      title: string;
    }>;
  };
}

export const TemplateParams = `{
  description: string;
  title: string;
  instructions: string;
  steps: Array<{
    sufix: string,
    title: string;
  }>
}`;
