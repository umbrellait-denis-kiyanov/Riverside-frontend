import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { of, timer } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ModuleService } from 'src/app/common/services/module.service';
import { Module } from 'src/app/common/interfaces/module.interface';
import { LeftMenuService } from 'src/app/common/services/left-menu.service';



@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit {
  ready = true;
  moduleData: Module;
  expanded = true;

  constructor(
    private leftMenuService: LeftMenuService
  ) { }

  ngOnInit() {
    this.leftMenuService.onExpand.subscribe((expanded) => this.expanded = expanded);
  }

  expand() {
    this.leftMenuService.expand = true;
  }

  onClickTab(tabKey: string) {

  }
}
