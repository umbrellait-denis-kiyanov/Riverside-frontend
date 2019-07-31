import { TemplateContentDataBase } from '../template.interface';

export interface Template1Data extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    title: string;
    resource: string;
    footer: string;
  };
}
