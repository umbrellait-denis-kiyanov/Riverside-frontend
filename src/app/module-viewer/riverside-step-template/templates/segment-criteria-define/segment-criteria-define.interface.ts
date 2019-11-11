import { TemplateContentDataBase } from '../template.interface';

export interface SegmentCriteriaDefineTemplateData extends TemplateContentDataBase {
  template_params_json: {
    step_select: '1_define_segments' | '2_brainstorm_criteria' | '3_define_criteria' |
                 '4_assign_weight' | '5_request_feedback_section_1' | '6_decide_letter_grades' |
                 '7_grade_customers' | '8_request_feedback_section_2';
    description: string;
    instructions?: string;
    number_of_inputs: number;
    inputs: string;
    title: string;
  };
}

