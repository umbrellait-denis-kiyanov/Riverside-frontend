import { TemplateContentDataBase } from '../template.interface';

export interface PersonaBehaviorTemplateData extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    resource: string;
    example: string;
    instructions: string;
    title: string;
    input_sufix: string;
    behavior: string;
    formatAsList: boolean;
    selection_matrix: Array<{
      question: string,
      options: Array<{option: string}>
    }>
  };
}
