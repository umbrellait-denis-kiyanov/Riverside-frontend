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
  defaultListContent: '<ul style="padding-left: 20px"><li><p></p></li></ul>';

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
        org_id: this.data.data.inputs[key] ? this.data.data.inputs[key].org_id : null,
        module_id: this.data.data.inputs[key] ? this.data.data.inputs[key].module_id : null,
        content: iceElement ? iceElement.innerHTML : '',
        element_key: key,
      };
      } else if (this.data.data.inputs[key]) {
        data.inputs[key]  = {...this.data.data.inputs[key], element_key: key};
      }
    });
    return data;
  }

  contentChanged() {
    this.moduleContentService.contentChanged.next(this.moduleContentService.contentChanged.getValue() + 1);
  }

  notEmpty(el: string) {
    return !!this.textContent(el);
  }

  textContent(el: string) {
    const _el: HTMLElement[] = window.$(el);
    return _el.length ? _el[0].textContent.replace(/\s/g, ' ') : '';
  }
}
