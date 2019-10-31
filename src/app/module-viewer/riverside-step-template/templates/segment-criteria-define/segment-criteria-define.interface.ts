import { TemplateContentDataBase } from '../template.interface';

export interface SegmentCriteriaDefineTemplateData extends TemplateContentDataBase {
  template_params_json: {
    step_select: '1_define_segments' | '2_brainstorm_criteria' | '3_define_criteria' | '4_assign_weight' | '5_grade_customers';
    description: string;
    instructions?: string;
    number_of_inputs: number;
    inputs: string;
    title: string;
  };
}

