import { TemplateContentDataBase } from '../template.interface';

export interface QuestionImageTemplateData extends TemplateContentDataBase {
  template_params_json: {
    instructions: string;
    image: string;
    title: string;
    questions: Array<{question: string}>
  };
}
