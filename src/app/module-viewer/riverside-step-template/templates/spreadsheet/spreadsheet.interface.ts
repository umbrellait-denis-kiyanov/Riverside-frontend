import { TemplateContentDataBase } from '../template.interface';

export interface SpreadsheetTemplateData extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    apiResource: string;
    visibleRows: string;
    title: string;
    requireFeedback: boolean;
    calculateFormulasOnServer: boolean;
  };
}
