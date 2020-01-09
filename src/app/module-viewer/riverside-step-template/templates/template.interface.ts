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

export type TemplateContentDataType =
  AgeGenderTemplateData |
  NarrowDownData |
  GenericTemplateData |
  BrainstormTemplateData |
  NamePersonasTemplateData |
  PersonaBehaviorTemplateData |
  FeedbackSectionTemplateData |
  QuestionImageTemplateData
  ;

export interface TemplateComponentInterface {
  data: TemplateContentData;
}

export interface TemplateContentDataBase {
  inputs?: {[key: string]: TemplateInput};
  disabled?: boolean;
}
