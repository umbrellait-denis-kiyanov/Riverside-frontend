
export interface Module {
  id: number;
  name: string;
  percComplete?: number;
  steps: Step[];
}
export interface Step {
  id?: number;
  description: string;
  is_checked?: boolean;
  waiting_for_feedback?: boolean;
  feedback_received?: boolean;
  is_section_break?: boolean;
  require_feedback?: boolean;
  template_component?: string;
  elements: LearningElement[];
}

export interface Section {
  section: Step,
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
