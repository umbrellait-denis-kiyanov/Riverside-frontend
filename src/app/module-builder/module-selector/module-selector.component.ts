import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute, ParamMap, RouterState, NavigationEnd, Event, Params } from '@angular/router';
import { ModuleService } from '../../common/services/module.service';


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
    route.params.subscribe((params) => {
      this.navigateToModuleIfNeeded(params);
    });
    // router.events.subscribe((event: Event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.navigateToModuleIfNeeded();
    //   }
    // });
  }

  ngOnInit() {

  }

  navigateToModuleIfNeeded(params: Params) {
    if (!params.id) {
      this.moduleService.loadModules({}).then(() => {
        this.router.navigateByUrl(`/builder/${this.moduleService.modules[0].id}`);
      });

    }
  }

  onChange(m) {
    this.router.navigateByUrl(`/builder/${m}`);
  }
}
