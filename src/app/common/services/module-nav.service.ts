import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModuleService } from './module.service';
import { AssessmentType, AssessmentGroup } from '../interfaces/assessment.interface';
import { filter, startWith, distinctUntilChanged, switchMap, shareReplay, take, map } from 'rxjs/operators';
import { AssessmentService } from './assessment.service';

export class ResourceFromStorage<T extends {toString: () => string}> {
  private _current: T;
  private storageKey: string;
  private default: T;
  private defaultObservable: Observable<T>;
  private type: 'json' | 'string' | 'number';
  public onChange =  new BehaviorSubject<T>(null);

  constructor(storageKey: string,  defaultObservable: Observable<T> = null, type: 'json' | 'string' | 'number' = 'json') {
    this.storageKey = storageKey;
    this.type = type;
    this.onChange.next(this.current);
    this.defaultObservable = defaultObservable;
    this.loadDefaultValue();
  }

  set current(value: T) {
    if (value === this._current) {
      return;
    }
    this._current = value;
    window.localStorage.setItem(this.storageKey, this.processToStorage());
    this.onChange.next(value);
  }

  get current(): T {
    if (this._current === undefined) {
      const fromStorage = window.localStorage.getItem(this.storageKey);
      if (fromStorage) {
        this._current = this.processFromStorage(fromStorage);
      }
    }

    if (this._current === undefined) {
      this.loadDefaultValue(true);
    }

    return this._current;
  }

  loadDefaultValue(force?: boolean) {
    if ((force || !this.current) && this.defaultObservable) {
      this.defaultObservable.pipe(take(1)).subscribe(value => {
        this.current = value;
      });
    }
  }

  processFromStorage(fromStorage: string) {
    if (this.type === 'json') {
      try {
        return JSON.parse(fromStorage);
      } catch (e) {
        return null;
      }
    }
    if (this.type === 'number') {
      return Number(fromStorage);
    }

    return fromStorage;
  }

  processToStorage() {
    if (this.type !== 'json') {
      return this._current.toString();
    } else {
      return JSON.stringify(this._current);
    }
  }
}

@Injectable()
export class ModuleNavService {
  assessmentType = new ResourceFromStorage<number>('last_type');
  activeAssessmentType$: Observable<AssessmentType>;
  assessmentGroup$ = new BehaviorSubject<AssessmentGroup>(null);
  activeAssessmentSessionId$ = new BehaviorSubject<number>(null);

  lastOrganization = new ResourceFromStorage<number>('last_organization_id',
                        this.moduleService.getDefaultOrganization().pipe(map(org => org.id)),
                        'number');

  organization$ = this.lastOrganization.onChange.pipe(
      filter(org => !!org),
      distinctUntilChanged()
    );

  module = new ResourceFromStorage<number>('last_module_id',
              this.moduleService.getDefaultModule().pipe(map(mod => mod.id)),
              'number');

  module$ = this.module.onChange.pipe(
      filter(m => !!m),
      distinctUntilChanged()
    );

  moduleData$ = this.module$.pipe(
      switchMap(id => this.moduleService.getModuleConfig(id))
    );

  step = new ResourceFromStorage<number>('last_step_id',
            this.moduleData$.pipe(map(mod => mod.steps.find(s => !s.is_section_break).id)),
            'number');

  step$ = this.step.onChange.pipe(
      filter(m => !!m),
      distinctUntilChanged()
    );

  get assessmentType$() {
    if (!this.activeAssessmentType$) {
      this.activeAssessmentType$ = this.assessmentType.onChange.pipe(
        startWith(this.assessmentType.current || 1),
        distinctUntilChanged(),
        filter(t => !!t),
        switchMap((type_id: number) => this.asmService.getType(type_id))
      );
    }

    return this.activeAssessmentType$;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private moduleService: ModuleService,
    private asmService: AssessmentService
  ) {
    this.moduleService.getOrganizations().subscribe(organizations => {
      const currentOrg = parseInt(this.route.snapshot.params.orgId, 10) || this.lastOrganization.current;
      this.lastOrganization.current = Number(currentOrg) ? Number(currentOrg) : Number(organizations[0].id);

      this.router.events.subscribe(val => {
        if (val instanceof RoutesRecognized) {
          const params = val.state.root.firstChild.params;

          if (params.orgId) {
            this.lastOrganization.current = Number(params.orgId);
          }
        }
      });
    });
   }

  getActivatedRoute(): ActivatedRoute {
    return this.route;
  }

  getRouter(): Router {
    return this.router;
  }

  nextStep() {
    this.moveToStep(1);
  }

  previousStep() {
    this.moveToStep(-1);
  }

  setAssessmentType(type: AssessmentType) {
    this.assessmentType.current = type.id;
  }

  goToStep(id: number) {
    this.router.navigate(['org', this.lastOrganization.current, 'module', this.module.current, 'step', id]);
  }

  private moveToStep(offset: number) {
    this.moduleData$.pipe(take(1)).subscribe(module => {
      let index = module.steps.findIndex(s => s.id === this.step.current);
      let step = null;
      do {
        index = Math.min(Math.max(0, index + offset), module.steps.length - 1);
        step = module.steps[index];
      } while (step.is_section_break || !index);

      this.goToStep(step.id);
    });
  }
}


