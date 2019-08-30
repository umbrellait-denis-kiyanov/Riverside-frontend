export interface ModuleStatus {
  is_activated: boolean;
  due_date?: string;
  due_date_edit?: string;
  is_late?: boolean;
}

export interface Module {
  id: number;
  name: string;
  percComplete?: number;
  steps: Step[];
  status?: ModuleStatus;
}

export interface Step {
  id?: number;
  module_id?: number;
  template_id?: number;
  linked_ids?: number[];
  description: string;
  is_checked?: boolean;
  is_approved?: boolean;
  waiting_for_feedback?: boolean;
  feedback_received?: boolean;
  is_section_break?: boolean;
  require_feedback?: boolean;
  template_component?: string;
  template_params_json: string;
  position?: number;
  elements: LearningElement[];
}

export interface Section {
  section: Step;
  steps: Step[];
}

function literalArray<T extends string>(array: T[]): T[] {
  return array;
}
export const LearningElementTypes = literalArray(['pdf', 'activity', 'youtube', 'gdoc']);

export interface LearningElement {
  type: typeof LearningElementTypes[number];
  data: string;
  tooltip?: string;
}
