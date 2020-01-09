import { TemplateContentData } from './template-data.class';
import { NarrowDownData } from './narrow-down';
import { GenericTemplateData } from './generic/generic.interface';
import { BrainstormTemplateData } from './brainstorm/brainstorm.interface';
import { NamePersonasTemplateData } from './name_personas/name_personas.interface';
import { PersonaBehaviorTemplateData } from './persona_behavior/persona_behavior.interface';
import { FeedbackSectionTemplateData } from './feedback_section/feedback_section.interface';
import { QuestionImageTemplateData } from './question-image/question-image.interface';
import { TemplateInput } from 'src/app/common/interfaces/module.interface';

export type TemplateContentDataType =
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
