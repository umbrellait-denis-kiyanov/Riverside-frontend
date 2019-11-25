import { TemplateContentDataBase } from '../template.interface';

export interface SpreadsheetTemplateData extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    title: string;
    apiResource: string;
    visibleRows: string;
  };
}
