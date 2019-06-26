import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { of, timer } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ModuleService } from 'src/app/common/services/module.service';
import { Module } from 'src/app/common/interfaces/module.interface';



@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {
  ready = false;
  moduleData: Module;
  expanded = true;

  constructor(
    private moduleService: ModuleService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.moduleService.getModule(params.moduleId).then(moduleData => {
        if (moduleData) {
          this.moduleData = moduleData;
          this.moduleService.module = moduleData;
        }
        this.ready = true;
      });

    });

  }

  onClickTab(tabKey: string) {

  }
}
