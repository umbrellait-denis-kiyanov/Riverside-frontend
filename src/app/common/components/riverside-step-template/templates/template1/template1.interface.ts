import { TemplateContentDataBase } from '../template.interface';

export interface Template1Data extends TemplateContentDataBase {
  inputs: {
    box1: {
      content: string,
      comments: any[]
    }
  };

}
