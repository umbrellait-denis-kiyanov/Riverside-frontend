import BaseModel from './base.model';
import { TemplateInput } from './module.interface';
import {
  TemplateContentDataBase,
} from 'src/app/module-viewer/riverside-step-template/templates/template.interface';

type ModuleContentJson = {inputs: {[key: string]: TemplateInput}};

class ModuleContent extends BaseModel {
  org_id: number = 0;
  id: number = 0;
  step_id: number = 0;
  module_id: number = 0;
  content_json: ModuleContentJson = {inputs: {}};
  inputs: {[key: string]: TemplateInput} = {};
  feedback_requested: boolean = false;
  feedback_started: boolean = false;
  template_params_json: TemplateContentDataBase = {};
  template_component = '';
  is_section_break: boolean = false;
  requires_feedback: boolean = false;
  is_approved: boolean = false;
  can_modify: boolean = false;
  disabled: boolean = false;
  is_checked: boolean = false;
  waiting_for_feedback: boolean = false;
  feedback_received: boolean = false;
  options: { [key: string]: string } = {};

  protected transform() {
    return {
      content_json: (val: ModuleContentJson) => {
        if (val && (!val.inputs || Array.isArray(val.inputs))) {
          val.inputs = {};
        }
        return val;
      }
    };
  }
}
export default ModuleContent;
