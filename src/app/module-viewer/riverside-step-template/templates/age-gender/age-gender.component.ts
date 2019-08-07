import { Component, OnInit, ElementRef } from '@angular/core';
import { PersonaInputs } from '../persona-ids.class';
import { TemplateComponent } from '../template-base.cass';
import { AgeGenderTemplateData } from './age-gender.interface';
import { ModuleContentService } from 'src/app/common/services/module-content.service';
import { UserService } from 'src/app/common/services/user.service';
import Message from 'src/app/module-viewer/inbox/message.model';

@Component({
  selector: 'app-age-gender',
  templateUrl: './age-gender.component.html',
  styleUrls: ['./age-gender.component.sass']
})
export class AgeGenderComponent extends TemplateComponent implements OnInit {
  allIds: string[] = [];
  inputIds: PersonaInputs;
  contentData: AgeGenderTemplateData['template_params_json'];
  traits = [
    {
      id: 'age',
      title: 'Age'
    },
    {
      id: 'perc_male',
      title: '% Male',
    },
    {
      id: 'perc_female',
      title: '% Female',
    },
    {
      id: 'education',
      title: 'Typical education',
    }
  ];

  constructor(
    protected el: ElementRef,
    protected moduleContentService: ModuleContentService,
    private userService: UserService
  ) {
    super(el, moduleContentService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected init() {
    this.contentData = this.data.data.template_params_json as AgeGenderTemplateData['template_params_json'];
    this.initIds();
    ['fromPreviousSteps'].forEach(key => {
      this.inputIds[key].forEach((persona) => {
        Object.values(persona).forEach((id2: string) => {
          this.inputs[id2] = this.inputs[id2] || '';
          this.allIds.push(id2);
        });
      });
    });
    // this.contentData = this.data.data.template_params_json;
  }

  initIds() {
    this.inputIds = new PersonaInputs({
      numberOfPersonas: 6,
      previousSteps: {
        title: {
          prefix: 'persona'
        },
        name: {
          prefix: 'persona_name'
        },
        picture: {
          prefix: 'persona_picture'
        },
        ...this.traitInputs()
      }
    });
  }

  traitInputs() {
    const traitInputs = {};
    this.traits.forEach(trait => {
      traitInputs[trait.id] = {
        prefix: 'persona_' + trait.id,
      };
    });
    return traitInputs;
  }

  notEmpty(el: string) {
    return !!this.textContent(el);
  }

  textContent(el: string) {
    const _el: HTMLElement[] = window.$(el);
    return _el.length ? _el[0].textContent.replace(/\&nbsp;/g, ' ') : '';
  }

}
