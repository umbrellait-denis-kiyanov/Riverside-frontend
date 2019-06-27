
export interface Module {
  id: number;
  name: string;
  google_doc_url: string;
  percComplete?: number;
  steps: Step[];
}
export interface Step {
  description: string;
  google_doc_url?: string;
  isChecked?: boolean;
  elements: LearningElement[];
}

function literalArray<T extends string>(array: T[]): T[] {
  return array;
}
export const LearningElementTypes = literalArray(['pdf', 'txt', 'youtube', 'gdoc']);

export interface LearningElement {
  type: typeof LearningElementTypes[number];
  data: string;
  tooltip?: string;
}
