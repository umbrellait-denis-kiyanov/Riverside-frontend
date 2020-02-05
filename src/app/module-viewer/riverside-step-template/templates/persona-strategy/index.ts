import { TemplateContentDataBase } from '../template.interface';

export interface PersonaStrategyTemplateData extends TemplateContentDataBase {
  template_params_json: {
    step_type_select: '1_key_issues' | '2_additional_questions' | '3_message_flow';
    description: string;
    title: string;
    inputs: string;
  };
}

export const TemplateParams = `{
  step_type_select: '1_key_issues' | '2_additional_questions' | '3_message_flow';
  description: string;
  title: string;
  inputs: string;
}`;