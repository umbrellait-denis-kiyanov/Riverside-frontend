import { BehaviorSubject } from 'rxjs';

export interface ModuleStatus {
  org_id: number;
  is_activated: boolean;
  due_date?: string;
  is_late?: boolean;
  progress: number;
  notes: string;
  assigned_to: string;
  assessment_mkt: number;
  assessment_sales: number;
}

export interface Module {
  id: number;
  name: string;
  progress: number;
  steps: Step[];
  status?: ModuleStatus;
  underConstruction?: boolean;
}

export interface Input {
  id: number;
  org_id: number;
  module_id: number;
  element_key: string;
  content: string;
  comments_json: string;
  observer: BehaviorSubject<string>;
  error: BehaviorSubject<string>;
  getValue: () => string;
}

export interface Organization {
  id: number;
  name: string;
  progress?: number;
}

export interface Step {
  id?: number;
  module_id?: number;
  linked_ids?: number[];
  description: string;
  is_checked?: boolean;
  is_approved?: boolean;
  waiting_for_feedback?: boolean;
  feedback_received?: boolean;
  is_section_break?: boolean;
  requires_feedback?: boolean;
  template_component?: string;
  template_params_json: object;
  position?: number;
  isLocked?: false | string[];
}

export interface Section {
  section: Step;
  steps: Step[];
}

export interface Template {
  id: string;
  params_json: string;
  name?: string;
  description?: string;
  hasInputs: boolean;
}

export interface SpreadsheetResource {
  data: string[][];
  meta: {
    classes: {[className: string]: {[property: string]: string}},
    mergeCells: {col: number, row: number, colspan: number, rowspan: number}[],
    colWidths: number[],
    formatting: {[cells: string]: string},
    editable: string[],
    maxColumn: string
  }
}