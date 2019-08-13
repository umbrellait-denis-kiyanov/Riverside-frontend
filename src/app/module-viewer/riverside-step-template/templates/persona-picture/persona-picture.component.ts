import { Component, ElementRef } from '@angular/core';

import { TemplateComponent } from '../template-base.cass';
import { data } from './exampleData';
import { PersonaPictureTemplateData } from './persona-picture.interface';
import { ModuleContentService } from 'src/app/common/services/module-content.service';
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
    fromPreviousStep: [
      {
        title: 'persona_1',
        name: 'persona_name_1'
      },
      {
        title: 'persona_2',
        name: 'persona_name_2'
      },
      {
        title: 'persona_3',
        name: 'persona_name_3'
      },
      {
        title: 'persona_4',
        name: 'persona_name_4'
      },
      {
        title: 'persona_5',
        name: 'persona_name_5'
      },
      {
        title: 'persona_6',
        name: 'persona_name_6'
      }
    ],
    personas: [
      'persona_picture_1',
      'persona_picture_2',
      'persona_picture_3',
      'persona_picture_4',
      'persona_picture_5',
      'persona_picture_6',
    ]

  };


  contentData: PersonaPictureTemplateData['template_params_json'];

  // contentData = data;

  constructor(
    protected el: ElementRef,
    protected moduleContentService: ModuleContentService,
    protected modalService: NgbModal
  ) {
    super(el, moduleContentService);
  }

  protected init() {
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
      this.contentChanged();
    });
  }
}
