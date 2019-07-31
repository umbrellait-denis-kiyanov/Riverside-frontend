import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as InlineEditor from '@ckeditor/ckeditor5-build-inline';
import { Module } from '../../common/interfaces/module.interface';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';

@Component({
  selector: 'app-request-feedback',
  templateUrl: './request-feedback.component.html',
  styleUrls: ['./request-feedback.component.sass']
})
export class RequestFeedbackComponent implements OnInit {

  @Input() params: any;

  public Editor = InlineEditor;
  ready = false;
  module: Module;
  message: string = '';

  constructor(
    public modal: NgbActiveModal,
    private navService: ModuleNavService
  ) { }

  ngOnInit() {
    setTimeout(async () => {
      this.module = await this.navService.module.getLast();
      this.ready = true;
    });

  }

}
