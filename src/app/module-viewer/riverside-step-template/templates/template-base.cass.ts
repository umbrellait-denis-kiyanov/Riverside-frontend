import { TemplateContentData } from './template-data.class';
import { OnInit, ElementRef, Component, OnDestroy } from '@angular/core';
import { TemplateComponentInterface, TemplateContentDataType } from './template.interface';
import User from 'src/app/common/interfaces/user.model';
import { ModuleContentService } from 'src/app/common/services/module-content.service';
import { ModuleService } from 'src/app/common/services/module.service';
import { UserService } from 'src/app/common/services/user.service';
import { Injector } from '@angular/core';
import { Input } from 'src/app/common/interfaces/module.interface';
import { BehaviorSubject } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Validation, Validate } from 'src/app/common/validator.class';

@Component({})
export abstract class TemplateComponent implements TemplateComponentInterface, OnInit, OnDestroy {
  contentData: any;
  data: TemplateContentData;
  hideChanges: boolean;
  inputs: {[key: string]: Input};
  disabled: boolean;
  me: User;
  defaultListContent: '<ul style="padding-left: 20px"><li><p></p></li></ul>';
  activePersonas: any[];
  action: string;
  instanceExists = true;

  public prefix = '';

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

    Object.keys(this.inputs).map(key => this.decorateInput(this.inputs[key]));

    this.initAction();
  }

  protected initAction() {
    if (this.userService.me.permissions.riversideProvideFeedback) {
      this.action = 'approve';
    } else { this.action = ''; }
  }

  ngOnDestroy() {
    this.instanceExists = false;
  }

  whileExists() {
    return takeWhile(() => this.instanceExists);
  }

  // abstract validate(): boolean;
  validate() {
    return true;
  }

  protected init() {}

  hasInputs() {
    return true;
  }

  contentChanged(data: Input) {
    if (data) {
      this.moduleService.saveInput(data).subscribe();
      if (data.observer) {
        data.observer.next(data.getValue());
      }
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

  decorateInput(inp: Input) {
    if (inp && !inp.getValue) {
      inp.getValue = () => {
        if (!inp.content) {
          return '';
        }
        const div = document.createElement('div');
        div.innerHTML = inp.content.split('<br>').join('\n');

        // Remove contents deleted but still visible because of changes tracker
        const deletedEls = div.getElementsByClassName('del');
        for (const el of deletedEls  as any) {
          el.parentNode.removeChild(el);
        }

        const text = (div.textContent || div.innerText || '').trim();
        div.remove();
        return text;
      };

      inp.observer = new BehaviorSubject(inp.getValue());
      inp.error = new BehaviorSubject(null);
    }

    return inp;
  }

  getInput(fieldName: string, num: number): Input {
    return this.decorateInput(this.inputs[this.prefix + fieldName + '_' + String(num)]);
  }

  validateInput(inp: Input, validators: Validation[] = []) {
    if (!validators.length) {
      validators.push(Validate.required('Please fill out this field'));
    }

    const err = Validate.getErrorMessage(validators, inp.getValue());
    inp.error.next(err);

    return !err;
  }

  resetError(input: Input) {
    if (input.error) {
      input.error.next(null);
    }
  }
}
