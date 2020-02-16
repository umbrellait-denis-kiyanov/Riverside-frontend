import { TemplateContentData } from './template-data.class';
import { AgeGenderTemplateData } from './age-gender';
import { NarrowDownData } from './narrow-down';
import { GenericTemplateData } from './generic';
import { BrainstormTemplateData } from './brainstorm';
import { NamePersonasTemplateData } from './name_personas';
import { PersonaBehaviorTemplateData } from './persona_behavior';
import { FeedbackSectionTemplateData } from './feedback_section';
import { QuestionImageTemplateData } from './question-image';
import { TemplateInput } from 'src/app/common/interfaces/module.interface';
import { SegmentCriteriaDefineTemplateData } from './segment-criteria-define';
import { SpreadsheetTemplateData } from './spreadsheet';
import { PreRequisiteModuleTemplateData } from './pre-requisite-modules';
import { ModuleResultTemplateData } from './module-result';
import { CampaignCalendarTemplateData } from './campaign-calendar-template';

export type TemplateContentDataType =
  AgeGenderTemplateData |
  NarrowDownData |
  GenericTemplateData |
  BrainstormTemplateData |
  NamePersonasTemplateData |
  PersonaBehaviorTemplateData |
  FeedbackSectionTemplateData |
  QuestionImageTemplateData |
  SpreadsheetTemplateData |
  SegmentCriteriaDefineTemplateData |
  PreRequisiteModuleTemplateData |
  ModuleResultTemplateData |
  CampaignCalendarTemplateData
  ;

export interface TemplateComponentInterface {
  data: TemplateContentData;
}

export interface TemplateContentDataBase {
  inputs?: {[key: string]: TemplateInput};
  disabled?: boolean;
  template_params_json?: {
    description: string;
    number_of_inputs?: number;
    title: string;
    inputs?: string;
  }
}

export interface TemplateOption {
  key?: string;
  value?: string;
}
