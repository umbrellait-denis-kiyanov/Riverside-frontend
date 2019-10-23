import { TemplateContentData } from './template-data.class';
import { OnInit, ElementRef, Component } from '@angular/core';
import { TemplateComponentInterface, TemplateContentDataType } from './template.interface';
import User from 'src/app/common/interfaces/user.model';
import { ModuleContentService } from 'src/app/common/services/module-content.service';
import { ModuleService } from 'src/app/common/services/module.service';
import { UserService } from 'src/app/common/services/user.service';
import { Injector } from '@angular/core';
import { Input } from 'src/app/common/interfaces/module.interface';

@Component({})
export abstract class TemplateComponent implements TemplateComponentInterface, OnInit {
  data: TemplateContentData;
  hideChanges: boolean;
  inputs: any;
  disabled: boolean;
  me: User;
  action: string;
  defaultListContent: '<ul style="padding-left: 20px"><li><p></p></li></ul>';
  activePersonas: any[];

  constructor(
      protected el: ElementRef,
      protected moduleContentService: ModuleContentService,
      protected moduleService: ModuleService,
      protected userService: UserService,
      protected injectorObj: Injector
    ) {}

  abstract getDescription(): string;

  abstract getName(): string;

  ngOnInit() {
    this.data.onHideChanges.subscribe((val: boolean) => this.hideChanges = val);
    this.inputs = this.data.data.inputs;
    this.disabled = this.data.data.disabled;
    this.me = this.data.me;

    this.activePersonas = Object.values(this.inputs).filter(i => i).map(i => {
      const input = (i as any);
      return input.element_key &&
             input.element_key.match(/^persona_[0-9]+$/) &&
             input.content && input.content !== '<p><br></p>' ?
          input.element_key : null;
    }).filter(i => i);

    this.init();
    this.initAction();
  }

  protected initAction() {
    if (this.userService.me.permissions.riversideProvideFeedback) {
      this.action = 'approve';
    } else { this.action = ''; }
  }

  protected init() {}

  hasInputs() {
    return true;
  }

  prepareData() {
    const data: any = {inputs: {}};

    Object.keys(this.inputs).forEach(key => {
      const iceElement = this.el.nativeElement.querySelector(`#${key} #textbody`);
      if (iceElement) {
        const input = this.data.data.inputs[key] || {} as any;
        data.inputs[key] = {
          comments_json: input.comments_json || [],
          org_id: input.org_id || null,
          module_id: input.module_id || null,
          content: input.content || null,
          element_key: key
        };
      } else if (this.data.data.inputs[key]) {
        data.inputs[key]  = {...this.data.data.inputs[key], element_key: key};
      }
    });
    return data;
  }

  contentChanged(data: Input) {
    if (data) {
      this.moduleService.saveInput(data).subscribe();
    }
  }

  notEmpty(el: string) {
    return !!this.textContent(el);
  }

  textContent(el: string) {
    const _el: any = window.$(el).clone();
    _el.find('.del').remove();
    return _el.length ? _el[0].textContent.replace(/\s/g, ' ') : '';
  }

  isEnabled() {
    return true;
  }
}
