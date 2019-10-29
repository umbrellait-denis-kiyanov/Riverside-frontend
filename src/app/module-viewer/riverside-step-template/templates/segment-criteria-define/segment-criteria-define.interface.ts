import { TemplateContentDataBase } from '../template.interface';

export interface SegmentCriteriaDefineTemplateData extends TemplateContentDataBase {
  template_params_json: {
    step_select: '1_define_segments' | '2_brainstorm_criteria' | '3_define_criteria' | '4_assign_weight';
    description: string;
    instructions?: string;
    inputs: string;
    title: string;
  };
}

