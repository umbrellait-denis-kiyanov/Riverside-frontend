import { TemplateContentDataBase } from "../template.interface";

export interface PersonaPictureTemplateData extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    title: string;
  };
}
