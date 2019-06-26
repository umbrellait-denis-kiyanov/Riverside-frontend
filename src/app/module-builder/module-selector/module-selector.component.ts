import { Component, OnInit } from '@angular/core';
import { Module } from '../module-editor/module.interface';
import { modules } from '../mockData';
import { Router, ActivatedRoute, ParamMap, RouterState, NavigationEnd, Event } from '@angular/router';
import { ModuleService } from '../module.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-module-selector',
  templateUrl: './module-selector.component.html',
  styleUrls: ['./module-selector.component.sass']
})
export class ModuleSelectorComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public moduleService: ModuleService
  ) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.navigateToModuleIfNeeded();
      }
    });
  }

  ngOnInit() {

  }

  navigateToModuleIfNeeded() {
    if (!this.route.firstChild) {
      this.moduleService.loadModules({}).then(() => {
        this.router.navigateByUrl(`/builder/${this.moduleService.modules[0].id}`);
      });

    }
  }

  onChange(m) {
    this.router.navigateByUrl(`/builder/${m}`);
  }
}
