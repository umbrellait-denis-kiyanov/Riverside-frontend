import { TemplateContentData } from './template-data.class';
import { OnInit, ElementRef, Component } from '@angular/core';
import { TemplateComponentInterface, TemplateContentDataType } from './template.interface';
import User from 'src/app/common/interfaces/user.model';

@Component({})
export class TemplateComponent implements TemplateComponentInterface, OnInit {
  data: TemplateContentData;
  hideChanges: boolean;
  inputs: any;
  disabled: boolean;
  me: User;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.data.onHideChanges.subscribe((val: boolean) => this.hideChanges = val);
    this.inputs = this.data.data.inputs;
    this.disabled = this.data.data.disabled;
    this.me = this.data.me;
    this.init();
  }

  protected init() {}

  prepareData() {
    const data: TemplateContentDataType = JSON.parse(JSON.stringify(this.data.data));

    Object.keys(this.inputs).forEach(key => {
      data.inputs[key] = {
        comments: data.inputs[key].comments,
        content: this.el.nativeElement.querySelector(`#${key} #textbody`).innerHTML,
      };
    });
    return data;
  }
}
