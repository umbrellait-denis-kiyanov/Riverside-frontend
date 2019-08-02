import { Template1Data } from './template1/template1.interface';
import { TemplateContentData } from './template-data.class';
import { OnInit } from '@angular/core';
import { Template2Data } from './template2/template2.interface';
import { GenericTemplateData } from './generic/generic.interface';
import { BrainstormTemplateData } from './brainstorm/brainstorm.interface';
import { NamePersonasTemplateData } from './name_personas/name_personas.interface';
import { PersonaBehaviorTemplateData } from './persona_behavior/persona_behavior.interface';

export type TemplateContentDataType =
  Template1Data |
  Template2Data |
  GenericTemplateData |
  BrainstormTemplateData |
  NamePersonasTemplateData |
  PersonaBehaviorTemplateData
  ;

export interface TemplateComponentInterface {
  data: TemplateContentData;
}


export interface TemplateContentDataBase {
  inputs?: {[key: string]: {
    content_id?: number,
    comments_json: any[],
    content: string
  }};
  disabled?: boolean;
}


