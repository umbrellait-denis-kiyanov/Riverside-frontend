import { TemplateContentData } from './template-data.class';
import {
  OnInit,
  ElementRef,
  OnDestroy,
  Injector,
  Injectable
} from '@angular/core';
import { TemplateComponentInterface } from './template.interface';
import User from 'src/app/common/interfaces/user.model';
import { ModuleContentService } from 'src/app/common/services/module-content.service';
import { ModuleService } from 'src/app/common/services/module.service';
import { UserService } from 'src/app/common/services/user.service';
import { TemplateInput } from 'src/app/common/interfaces/module.interface';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { Validation, Validate } from 'src/app/common/validator.class';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';
import { BuyerPersona } from '../../../common/interfaces/buyer-persona.interface';
import { BuyerPersonasService } from '../../../common/services/buyer-personas.service';

@Injectable()
export abstract class TemplateComponent
  implements TemplateComponentInterface, OnInit, OnDestroy {
  protected abstract params: string;
  abstract contentData;

  data: TemplateContentData;
  hideChanges$: Observable<boolean>;
  inputs: { [key: string]: TemplateInput };
  disabled: boolean;
  me: User;
  defaultListContent: '<ul style="padding-left: 20px"><li><p></p></li></ul>';
  buyerPersonasList$: Observable<BuyerPersona[]>;
  contentChanged$ = new BehaviorSubject<TemplateInput>(null);
  action: string;
  instanceExists = true;
  isEmbedded = false;
  contentOptions: { [key: string]: string };

  public prefix = '';

  constructor(
    protected el: ElementRef,
    protected moduleContentService: ModuleContentService,
    protected moduleService: ModuleService,
    protected navService: ModuleNavService,
    protected userService: UserService,
    protected injectorObj: Injector,
    protected buyerPersonasService: BuyerPersonasService
  ) {}

  abstract getDescription(): string;

  abstract getName(): string;

  ngOnInit() {
    this.hideChanges$ = this.data.onHideChanges;

    this.inputs = this.data.data.inputs;
    this.disabled = this.data.data.disabled;
    this.me = this.data.me;
    this.contentOptions = this.data.data.options;

    this.buyerPersonasList$ = this.buyerPersonasService.getBuyerPersonas();

    Object.keys(this.inputs).map(key => this.decorateInput(this.inputs[key]));
    this.init();
    this.initAction();
  }

  protected initAction() {
    this.action = this.userService.me.permissions.riversideProvideFeedback
      ? 'approve'
      : 'mark_as_done';
  }

  ngOnDestroy() {
    this.instanceExists = false;
  }

  whileExists() {
    return takeWhile(() => this.instanceExists);
  }

  validate() {
    return of(true);
  }

  protected init() {}

  hasInputs() {
    return true;
  }

  contentChanged(data: TemplateInput) {
    if (data) {
      this.moduleService
        .saveInput(data)
        .subscribe(_ => this.contentChanged$.next(data));
      if (data.observer) {
        data.observer.next(data.getValue());
      }
    }
  }

  notEmpty(el: string) {
    return !!this.textContent(el);
  }

  textContent(el: string) {
    const parser = new DOMParser().parseFromString(el || '', 'text/html');

    parser.querySelectorAll('.del').forEach(deleted => deleted.remove());

    return parser.body.textContent.trim().replace(/\s/g, ' ');
  }

  isEnabled() {
    return true;
  }

  decorateInput(inp: TemplateInput) {
    if (inp && !inp.getValue) {
      inp.getValue = () => {
        if (!inp.content) {
          return '';
        }
        const div = document.createElement('div');
        div.innerHTML = inp.content.split('<br>').join('\n');

        // Remove contents deleted but still visible because of changes tracker
        const deletedEls = div.getElementsByClassName('del');
        for (const el of Array.prototype.slice.call(deletedEls) as Element[]) {
          el.parentNode.removeChild(el);
        }

        const text = (div.innerHTML || '')
          .trim()
          .split('<p></p>')
          .join('')
          .split('class="ins cts-')
          .join('class="');

        div.remove();

        return text;
      };

      inp.observer = new BehaviorSubject(inp.getValue());
      inp.error = new BehaviorSubject(null);
      inp.selections$ = new BehaviorSubject([]);
    }

    return inp;
  }

  getInput(fieldName: string, num?: number, prefix?: string): TemplateInput {
    const id =
      (typeof prefix === 'string' ? prefix : this.prefix) +
      fieldName +
      (num ? '_' + String(num) : '');

    return this.decorateInput(this.inputs[id]);
  }

  validateInput(inp: TemplateInput, validators: Validation[] = []) {
    if (!validators.length) {
      validators.push(Validate.required('Please fill out this field'));
    }

    const err = Validate.getErrorMessage(validators, inp.getValue());
    inp.error.next(err);

    return !err;
  }

  resetError(input: TemplateInput) {
    if (input.error) {
      input.error.next(null);
    }
  }

  getBuilderParams() {
    const indexStart =
      this.params.indexOf('template_params_json: ') +
      'template_params_json: '.length;
    const closedBrace = this.params.indexOf('}', indexStart);
    const countBraces = (
      this.params.substring(indexStart, closedBrace).match(/{/g) || []
    ).length;
    let lastBrace = closedBrace;
    for (let i = 0; i < countBraces - 1; i++) {
      lastBrace = this.params.indexOf('}', lastBrace + 1);
    }

    return this.params.substring(indexStart, lastBrace + 1);
  }
}
