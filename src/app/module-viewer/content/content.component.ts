import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Module } from 'src/app/common/interfaces/module.interface';
import { ModuleService } from 'src/app/common/services/module.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.sass']
})
export class ContentComponent implements OnInit {
  iframeUrl: string;
  module: Module;
  ready = false;

  constructor(
    private route: ActivatedRoute,
    private moduleService: ModuleService
  ) { }

  ngOnInit() {
    this.module = this.moduleService.module;
    if (Array.isArray(this.module)) {
      return;
    }
    this.route.queryParams.subscribe(params => {
      if (params.step) {
        const step = this.module.steps[Number(params.step)];
        if (step && step.google_doc_url) {
          this.iframeUrl = step.google_doc_url;
          return;
        }
      }

      this.iframeUrl = this.module.google_doc_url;
      this.ready = true;
    });
  }

}
