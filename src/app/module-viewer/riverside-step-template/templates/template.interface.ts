import { Template1Data } from './template1/template1.interface';
import { TemplateContentData } from './template-data.class';
import { OnInit } from '@angular/core';
import { Template2Data } from './template2/template2.interface';

export type TemplateContentDataType = Template1Data | Template2Data;

export interface TemplateComponentInterface {
  data: TemplateContentData;
}


export interface TemplateContentDataBase {
  inputs?: {[key: string]: {
    comments: any[],
    content: string
  }};
  disabled?: boolean;
}


