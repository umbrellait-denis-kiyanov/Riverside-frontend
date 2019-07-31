import { Template1Data } from './template1/template1.interface';
import { TemplateContentData } from './template-data.class';
import { OnInit } from '@angular/core';

export type TemplateContentDataType = Template1Data;

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


