import { Injectable, EventEmitter } from '@angular/core';
import { Module } from '../interfaces/module.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IceService } from 'src/app/module-viewer/ice/ice.service';
import { ModuleService } from './module.service';

class ResourceFromStorage<T extends {toString: () => string}> {
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
  module = new ResourceFromStorage<Module>('last_module');
  stepIndex = new ResourceFromStorage<number>('last_step', 0, 'number');
  onApprove = new EventEmitter<boolean>(false);
  onUnapprove = new EventEmitter<boolean>(false);

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
    iceService.onUnapprove.subscribe(val => this.onUnapprove.emit(val));
   }

  updateProgress(module: Module) {
    const numerator = module.steps.filter(s => !s.is_section_break).map(s => Number(!!s.is_checked)).reduce((prev, curr) => prev + curr);
    const denominator = module.steps.filter(s => !s.is_section_break).length;
    module.percComplete = Math.round(100 * numerator / denominator);
  }

  setStepFromId(id: number) {
    this.stepIndex.current = this.module.current.steps.findIndex(step => Number(step.id) === Number(id)) || 0;
    return this.stepIndex.current;
  }

  getModule(id: number, orgId: string) {
    return this.moduleService.getModule(id, orgId).then(async (moduleData: Module) => {
        this.module.current = moduleData;
        this.updateProgress(this.module.current);
        return moduleData;
    });
  }

  // setStepFromUrl() {
  //   this.stepIndex.current = this.module.current.steps.findIndex(step => Number(step.id) === Number(id)) || 0;
  //   return this.stepIndex.current;
  // }

  nextStep() {
    this.moveToStep(1);
  }

  previousStep() {
    this.moveToStep(-1);
  }

  private moveToStep(offset: number) {
    const index = this.stepIndex.current;
    if (this.module.current.steps.length === index + offset || index + offset < 0) {
      return;
    }
    this.stepIndex.current = Number(index) + offset;
    const step = this.module.current.steps[this.stepIndex.current];
    if (step.template_component && !step.is_section_break) {
      this.router.navigate(['module', this.module.current.id, 'step', step.id]);
    } else {
      return offset === 1 ? this.nextStep() : this.previousStep();
    }
  }

  async markAsDone(stepId: number, is_checked: boolean = true) {
    return this.http.post(`/api/modules/0/step/${stepId}/done`, {is_checked}).toPromise()
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
    return this.http.post(`/api/modules/0/step/${stepId}/done`, {is_approved}).toPromise()
      .then(() => {
        const stepIndex = this.setStepFromId(stepId);
        const step = this.module.current.steps[stepIndex];
        if (step) {
          step.is_approved = is_approved;
          step.is_approved && this.onApprove.emit(true);
        }
        this.updateProgress(this.module.current);
      });
  }
}


