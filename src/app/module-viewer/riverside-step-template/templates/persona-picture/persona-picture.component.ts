import { Component, forwardRef } from '@angular/core';

import { TemplateComponent } from '../template-base.class';
import { PersonaPictureTemplateData, TemplateParams } from '.';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonaPictureListComponent } from './persona-picture-list/persona-picture-list.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-persona-picture',
  templateUrl: './persona-picture.component.html',
  styleUrls: ['./persona-picture.component.sass'],
  preserveWhitespaces: true,
  providers: [{ provide: TemplateComponent, useExisting: forwardRef(() => PersonaPictureTemplateComponent) }]
})

export class PersonaPictureTemplateComponent extends TemplateComponent {
  params = TemplateParams;
  inputIds = {
    fromPreviousStep: [ ],
    personas: [ ]
  };

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
    this.buyerPersonasList$.pipe(take(1)).subscribe(personas => {
      this.inputIds = {
        fromPreviousStep: personas.map(persona => ({title: persona.title, name: persona.name})),
        personas: personas.map(persona => `persona_picture_${persona.index}`),
      };
    });

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
