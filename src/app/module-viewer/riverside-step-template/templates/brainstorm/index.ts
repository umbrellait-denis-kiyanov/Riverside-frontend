import { TemplateContentDataBase } from "../template.interface";

export interface BrainstormTemplateData extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    title: string;
    questions: Array<{ question: string }>;
    number_of_inputs: number;
  };
}
