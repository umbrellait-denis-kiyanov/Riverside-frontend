import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Step, Module } from 'src/app/common/interfaces/module.interface';

@Component({
  selector: 'app-step-link-editor',
  templateUrl: './step-link-editor.component.html',
  styleUrls: ['./step-link-editor.component.sass']
})
export class StepLinkEditorComponent implements OnInit {
  @Input() step: Step;
  @Input() module: Module;

  linked_ids = {};

  constructor(public modal: NgbActiveModal) {}

  ngOnInit() {
    this.linked_ids = (this.step.linked_ids || []).reduce((ids, id) => {
      ids[id] = true;
      return ids;
    }, {});
  }

  save() {
    this.step.linked_ids = Object.entries(this.linked_ids).reduce(
      (ids, entry) => {
        if (entry[1]) {
          ids.push(entry[0]);
        }
        return ids;
      },
      []
    );
    this.modal.close();
  }
}
