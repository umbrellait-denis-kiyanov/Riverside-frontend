import { TemplateContentDataBase } from '../template.interface';

export interface Template2Data extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    title: string;
  };
}
