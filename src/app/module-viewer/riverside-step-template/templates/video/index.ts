import { TemplateContentDataBase } from '../template.interface';

export interface VideoTemplateData extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    videoUrl: string;
    content: string;
    title: string;
  };
}

export const TemplateParams = `{
  description: string;
  videoUrl: string;
  content: string;
  title: string;
}`;
