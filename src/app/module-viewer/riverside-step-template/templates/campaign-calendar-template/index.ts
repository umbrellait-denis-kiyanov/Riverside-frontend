import { TemplateContentDataBase } from '../template.interface';

export interface CampaignCalendarTemplateData extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    title: string;
  };
}