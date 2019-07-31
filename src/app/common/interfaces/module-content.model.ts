


import BaseModel from './base.model';

class ModuleContent extends BaseModel {
  org_id: number = 0;
  id: number = 0;
  template_id: number = 0;
  step_id: number = 0;
  module_id: number = 0;
  content_json: any = {inputs: {}};
  inputs: any = {};
  feedback_requested: boolean = false;
  feedback_started: boolean = false;
  template_params_json: any = {};
  template_component = '';

  protected transform() {
    return {
      content_json: (val: any, data: any) => {
        if (val && (!val.inputs || Array.isArray(val.inputs))) {
          val.inputs = {};
        }
        return val;
      }
    };
  }
}
export default ModuleContent;
