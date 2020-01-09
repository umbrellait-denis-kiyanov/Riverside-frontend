import { TemplateContentDataBase } from '../template.interface';

export interface QuestionImageTemplateData extends TemplateContentDataBase {
  template_params_json: {
    instructions: string;
    image: string;
    title: string;
    questions: Array<{question: string}>
  };
}

export interface SegmentCriteria {
  name: {content: string, comments_json: string};
  description: {content: string, comments_json: string};
  weight?: number;
}