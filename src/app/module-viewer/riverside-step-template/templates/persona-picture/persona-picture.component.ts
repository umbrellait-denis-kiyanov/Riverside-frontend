import { Component } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';
import { PersonaPictureTemplateData } from './persona-picture.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonaPictureListComponent } from './persona-picture-list/persona-picture-list.component';

@Component({
  selector: 'app-persona-picture',
  templateUrl: './persona-picture.component.html',
  styleUrls: ['./persona-picture.component.sass'],
  preserveWhitespaces: true
})

export class PersonaPictureTemplateComponent extends TemplateComponent {
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

    this.inputIds = {
      fromPreviousStep: this.activePersonas.map(persona => ({title: persona, name: persona.split('_').join('_name_')})),
      personas: this.activePersonas.map(persona => persona.split('_').join('_picture_'))
    };

    this.contentData = this.data.data.template_params_json as PersonaPictureTemplateData['template_params_json'];
    Object.keys(this.inputIds).forEach(key => {
      this.inputIds[key].forEach((id, i) => {
        if (typeof id === 'string') {
          this.inputs[id] = this.inputs[id] || {content: ''};
        } else {
          Object.values(id).forEach((id2: string) => {
            this.inputs[id2] = this.inputs[id2] || {content: ''};
          });
        }
      });
    });

  }

  openModal(id: string) {
    const modalRef = this.modalService.open(PersonaPictureListComponent, {windowClass: 'picture-modal'});

    modalRef.result.then((src: string) => {
      this.inputs[id].content = src;
      this.contentChanged(this.inputs[id]);
    });
  }
}
