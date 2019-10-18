import { Injectable, EventEmitter } from '@angular/core';
import { Module } from '../interfaces/module.interface';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IceService } from 'src/app/module-viewer/ice/ice.service';
import { ModuleService } from './module.service';
import { AssessmentType, AssessmentGroup } from '../interfaces/assessment.interface';
import { filter, startWith, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AssessmentService } from './assessment.service';

export class ResourceFromStorage<T extends {toString: () => string}> {
  private _current: T;
  private storageKey: string;
  private default: T;
  private type: 'json' | 'string' | 'number';
  public onChange =  new BehaviorSubject<T>(null);

  constructor(storageKey: string,  defaultValue: T = null, type: 'json' | 'string' | 'number' = 'json') {
    this.storageKey = storageKey;
    this.default = defaultValue;
    this.type = type;
    this.onChange.next(this.current);
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
    if (this._current !== undefined) {
      return this._current;
    } else {
      const fromStorage = window.localStorage.getItem(this.storageKey);
      return fromStorage ? this.processFromStorage(fromStorage) : this.default;
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

  async getLast(): Promise<T | null> {
    return this.current;
  }
}

@Injectable()
export class ModuleNavService {
  lastOrganization = new ResourceFromStorage<number>('last_organization');
  module = new ResourceFromStorage<Module>('last_module');
  stepIndex = new ResourceFromStorage<number>('last_step', 0, 'number');
  assessmentType = new ResourceFromStorage<number>('last_type');

  onApprove = new EventEmitter<boolean>(false);
  onUnapprove = new EventEmitter<boolean>(false);
  onSave = new EventEmitter(false);
  shouldReloadModule = false;
  shouldMoveToNext = false;
  assessmentGroup$ = new BehaviorSubject<AssessmentGroup>(null);

  activeAssessmentType$: Observable<AssessmentType>;

  organization$ = this.lastOrganization.onChange.pipe(filter(org => !!org));

  get currentStep() {
    return this.module.current.steps[this.stepIndex.current];
  }

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
    private http: HttpClient,
    private iceService: IceService,
    private moduleService: ModuleService,
    private asmService: AssessmentService
  ) {

    this.onUnapprove.subscribe(() => {
      if (this.currentStep.requires_feedback) {
        this.shouldReloadModule = true;
      }
    });
    this.onApprove.subscribe(() => {
      if (this.currentStep.requires_feedback) {
        this.shouldReloadModule = true;
      } else {
        this.shouldMoveToNext = true;
      }
    });
    this.onSave.subscribe(() => {
      if (this.shouldReloadModule) {
        this.reloadModule();
        this.shouldReloadModule = false;
      }
      if (this.shouldMoveToNext) {
        this.nextStep();
        this.shouldMoveToNext = false;
      }
    });

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

  updateProgress(module: Module) {
    const numerator = module.steps.filter(s => !s.is_section_break).map(s => Number(!!s.is_approved)).reduce((prev, curr) => prev + curr);
    const denominator = module.steps.filter(s => !s.is_section_break).length;
    module.percComplete = Math.round(100 * numerator / denominator);
  }

  getStepId() {
    return this.module.current.steps[this.stepIndex.current].id;
  }

  setStepFromId(id: number) {
    this.stepIndex.current = this.module.current.steps.findIndex(step => Number(step.id) === Number(id)) || 0;
    return this.stepIndex.current;
  }

  reloadModule() {
    // this.getModule(this.module.current.id, this.lastOrganization.current);
  }

  // getModule(id: number, orgId: number) {
  //   return this.moduleService.getOrgModule(id, orgId).then(async (moduleData: Module) => {
  //       this.module.current = moduleData;
  //       this.moduleService.updateProgress(this.module.current);
  //       return moduleData;
  //   });
  // }

  nextStep() {
    this.moveToStep(1);
  }

  previousStep() {
    this.moveToStep(-1);
  }

  setAssessmentType(type: AssessmentType) {
    this.assessmentType.current = type.id;
  }

  private moveToStep(offset: number) {
    const { stepId } = this.route.snapshot.params;
    stepId && this.setStepFromId(stepId);
    const index = this.stepIndex.current;
    if (this.module.current.steps.length === index + offset || index + offset < 0) {
      return;
    }
    this.stepIndex.current = Number(index) + offset;
    const step = this.module.current.steps[this.stepIndex.current];
    if (!step.is_section_break) {
      this.router.navigate(['org', this.lastOrganization.current, 'module', this.module.current.id, 'step', step.id]);
    } else {
      return offset === 1 ? this.nextStep() : this.previousStep();
    }
  }
}


