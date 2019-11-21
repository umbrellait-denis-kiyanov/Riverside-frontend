import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, combineLatest } from 'rxjs';
import { Module } from 'src/app/common/interfaces/module.interface';
import { LeftMenuService } from 'src/app/common/services/left-menu.service';
import { map, filter, switchMap, take } from 'rxjs/operators';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';


@Component({
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class MainComponent implements OnInit, OnDestroy {
  ready = true;
  moduleData: Module;
  expanded = true;

  routeWatch: Subscription;
  stepWatch: Subscription;

  constructor(
    private leftMenuService: LeftMenuService,
    private navService: ModuleNavService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnDestroy() {
    this.routeWatch.unsubscribe();
    this.stepWatch.unsubscribe();
  }

  ngOnInit() {
    this.routeWatch = this.route.params.subscribe(
        params => {
          if (params.orgId) {
            this.navService.lastOrganization.current = Number(params.orgId);
          }

          if (params.moduleId) {
            this.navService.module.current = Number(params.moduleId);
          }
        }
      );

    const firstStep = this.navService.moduleData$.pipe(
      map(mod => mod.steps.find(s => !s.is_section_break).id)
    );

    this.stepWatch = combineLatest(this.navService.organization$, this.navService.module$, this.route.url).pipe(
      map(_ => !this.route.children.find(route => route.outlet === 'primary')),
      filter(f => !!f),
      take(1),
      switchMap(_ => firstStep),
    ).subscribe(stepId => this.navService.goToStep(stepId));
    
    this.leftMenuService.onExpand.subscribe((expanded) => this.expanded = expanded);
  }

  expand() {
    this.leftMenuService.expand = true;
  }
}
