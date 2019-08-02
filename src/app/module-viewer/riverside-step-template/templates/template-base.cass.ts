import { TemplateContentData } from './template-data.class';
import { OnInit, ElementRef, Component } from '@angular/core';
import { TemplateComponentInterface, TemplateContentDataType } from './template.interface';
import User from 'src/app/common/interfaces/user.model';
import { ModuleContentService } from 'src/app/common/services/module-content.service';

@Component({})
export class TemplateComponent implements TemplateComponentInterface, OnInit {
  data: TemplateContentData;
  hideChanges: boolean;
  inputs: any;
  disabled: boolean;
  me: User;

  constructor(
      protected el: ElementRef,
      protected moduleContentService: ModuleContentService
    ) {}

  ngOnInit() {
    this.data.onHideChanges.subscribe((val: boolean) => this.hideChanges = val);
    this.inputs = this.data.data.inputs;
    this.disabled = this.data.data.disabled;
    this.me = this.data.me;
    this.init();
  }

  protected init() {}

  prepareData() {
    const data: any = {inputs: {}};

    Object.keys(this.inputs).forEach(key => {
      const iceElement = this.el.nativeElement.querySelector(`#${key} #textbody`);
      if (iceElement) {
      data.inputs[key] = {
        comments_json: this.data.data.inputs[key] ? this.data.data.inputs[key].comments_json : [],
        content_id: this.data.data.inputs[key] ? this.data.data.inputs[key].content_id : [],
        content: iceElement ? iceElement.innerHTML : '',
      };
      }
    });
    return data;
  }

  contentChanged() {
    this.moduleContentService.contentChanged.next(this.moduleContentService.contentChanged.getValue() + 1);
  }
}
