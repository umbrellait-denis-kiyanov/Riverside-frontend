import { TemplateContentDataBase } from '../template.interface';
import { Module } from 'src/app/common/interfaces/module.interface';

export interface ModuleResultTemplateData extends TemplateContentDataBase {
  template_params_json: {
    description: string;
    content: string;
    title: string;
    module: Module;
  };
}