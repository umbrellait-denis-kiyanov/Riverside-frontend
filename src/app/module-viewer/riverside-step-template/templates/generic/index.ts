import { TemplateContentDataBase } from "../template.interface";

export interface GenericTemplateData extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    imageUrl: string;
    content: string;
    title: string;
  };
}
