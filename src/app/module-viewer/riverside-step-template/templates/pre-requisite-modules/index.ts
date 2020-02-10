import { TemplateContentDataBase } from '../template.interface';
import { Module } from 'src/app/common/interfaces/module.interface';

export interface PreRequisiteModuleTemplateData extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    instructions: string;
    title: string;
    modules: Array<{module: Module}>
  };
}

export const TemplateParams = `{
  description: string;
  instructions: string;
  title: string;
  modules: Array<{module: Module}>
}`;