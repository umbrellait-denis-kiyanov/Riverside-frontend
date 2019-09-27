import { Injectable, EventEmitter } from '@angular/core';
import { Module } from '../interfaces/module.interface';
import { Router, ActivatedRoute, RoutesRecognized } from '@angular/router';
import { BehaviorSubject, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IceService } from 'src/app/module-viewer/ice/ice.service';
import { ModuleService } from './module.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
  }
  set current(value: T) {
    this._current = value;
    window.localStorage.setItem(this.storageKey, this.processToStorage());
    this.onChange.next(value);
  }
  get current() {
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
  onApprove = new EventEmitter<boolean>(false);
  onUnapprove = new EventEmitter<boolean>(false);
  onSave = new EventEmitter(false);
  shouldReloadModule = false;
  shouldMoveToNext = false;
  organization$ = new BehaviorSubject<number>(null);

  get currentStep() {
    return this.module.current.steps[this.stepIndex.current];
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private iceService: IceService,
    private moduleService: ModuleService
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
      const initialOrg = parseInt(String(currentOrg), 10) ? currentOrg : organizations[0].id;

      this.organization$.next(parseInt(initialOrg, 10));

      this.router.events.subscribe(val => {
        if (val instanceof RoutesRecognized) {
          const params = val.state.root.firstChild.params;
          if (params.orgId) {
            if (this.organization$.value !== params.orgId) {
              this.organization$.next(parseInt(params.orgId, 10));
            }
            this.lastOrganization.current = params.orgId;
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
    this.getModule(this.module.current.id, this.organization$.value);
  }

  getModule(id: number, orgId: number) {
    return this.moduleService.getModule(id, orgId).then(async (moduleData: Module) => {
        this.module.current = moduleData;
        this.updateProgress(this.module.current);
        return moduleData;
    });
  }

  nextStep() {
    this.moveToStep(1);
  }

  previousStep() {
    this.moveToStep(-1);
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
      console.log()
      this.router.navigate(['org', this.organization$.value, 'module', this.module.current.id, 'step', step.id]);
    } else {
      return offset === 1 ? this.nextStep() : this.previousStep();
    }
  }

  async markAsDone(stepId: number, is_checked: boolean = true) {
    return this.http.post('/api/modules/' + this.module.current.id + '/org/' + this.organization$.value + '/step/' + stepId + '/done', {is_checked}).toPromise()
      .then(() => {
        const stepIndex = this.setStepFromId(stepId);
        const step = this.module.current.steps[stepIndex];
        if (step) {
          step.is_checked = is_checked;
        }
        this.updateProgress(this.module.current);
      });
  }

  async markAsApproved(stepId: number, is_approved: boolean = true) {
    return this.http.post('/api/modules/' + this.module.current.id + '/org/' + this.organization$.value + '/step/' + stepId + '/done', {is_approved, org_id: this.organization$.value}).toPromise()
      .then((response: number[]) => {
        const stepIndex = this.setStepFromId(stepId);
        const step = this.module.current.steps[stepIndex];
        if (step) {
          step.is_approved = is_approved;
          if (step.is_approved) {
            this.onApprove.emit(true);
            this.iceService.onApprove.emit();
            if (!this.currentStep.requires_feedback) {
              this.nextStep();
            }
          } else {
            this.onUnapprove.emit();
            if (!this.currentStep.requires_feedback) {
              this.reloadModule();
            }
          }
        }

        response.forEach(id => this.module.current.steps.find(st => st.id === id).is_approved = is_approved);

        this.updateProgress(this.module.current);
      });
  }
}


