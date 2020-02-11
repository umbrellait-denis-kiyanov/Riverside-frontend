import BaseModel from './base.model';
import { TemplateInput } from './module.interface';
import { TemplateContentDataBase } from 'src/app/module-viewer/riverside-step-template/templates/template.interface';

interface ModuleContentJson {
  inputs: { [key: string]: TemplateInput };
}

class ModuleContent extends BaseModel {
  org_id = 0;
  id = 0;
  step_id = 0;
  module_id = 0;
  content_json: ModuleContentJson = { inputs: {} };
  inputs: { [key: string]: TemplateInput } = {};
  feedback_requested = false;
  feedback_started = false;
  template_params_json: TemplateContentDataBase = {};
  template_component = '';
  is_section_break = false;
  requires_feedback = false;
  is_approved = false;
  can_modify = false;
  disabled = false;
  is_checked = false;
  waiting_for_feedback = false;
  feedback_received = false;

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
