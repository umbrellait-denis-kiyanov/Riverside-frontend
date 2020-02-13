import { Component, forwardRef } from '@angular/core';

import { TemplateComponent } from '../template-base.class';
import { PersonaPictureTemplateData } from '.';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonaPictureListComponent } from './persona-picture-list/persona-picture-list.component';
import txt from '!!raw-loader!./index.ts';

@Component({
  selector: 'app-persona-picture',
  templateUrl: './persona-picture.component.html',
  styleUrls: ['./persona-picture.component.sass'],
  preserveWhitespaces: true,
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => PersonaPictureTemplateComponent) }]
})

export class PersonaPictureTemplateComponent extends TemplateComponent {
  inputIds = {
    fromPreviousStep: [ ],
    personas: [ ]
  };
  params = txt;

  contentData: PersonaPictureTemplateData['template_params_json'];

  protected modalService: NgbModal;

  getDescription() {
    return '';
  }

  getName() {
    return 'Persona Picture';
  }

  protected init() {
    this.modalService = this.injectorObj.get(NgbModal);

    this.inputIds = {
      fromPreviousStep: this.activePersonas.map(persona => ({title: persona, name: persona.split('_').join('_name_')})),
      personas: this.activePersonas.map(persona => persona.split('_').join('_picture_'))
    };

    this.contentData = this.data.data.template_params_json as PersonaPictureTemplateData['template_params_json'];
  }

  openModal(id: string) {
    const modalRef = this.modalService.open(PersonaPictureListComponent, {windowClass: 'picture-modal'});
    const input = this.getInput(id);

    modalRef.result.then((src: string) => {
      input.content = src;
      this.contentChanged(input);
    });
  }
}
