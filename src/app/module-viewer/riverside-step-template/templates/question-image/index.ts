import { TemplateContentDataBase } from '../template.interface';

export interface QuestionImageTemplateData extends TemplateContentDataBase {
/* template-def-start */
  template_params_json: {
    description: string;
    instructions: string;
    image: string;
    title: string;
    questions: Array<{question: string}>
  };
/* template-def-end */
}

export interface SegmentCriteria {
  name: {content: string, comments_json: string};
  description: {content: string, comments_json: string};
  weight?: number;
}
