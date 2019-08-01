import { Injectable } from '@angular/core';
import { Module } from '../interfaces/module.interface';
import { Router } from '@angular/router';
import { BehaviorSubject, from } from 'rxjs';

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
    window.localStorage.setItem(this.storageKey, value.toString());
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
      return JSON.parse(fromStorage);
    }
    if (this.type === 'number') {
      return Number(fromStorage);
    }
    return fromStorage;

  }

  async getLast(): Promise<T | null> {
    return this.current;
  }
}
@Injectable()
export class ModuleNavService {
  module = new ResourceFromStorage<Module>('last_module');
  stepIndex = new ResourceFromStorage<number>('last_step', 0, 'number');

  get currentStep() {
    return this.module.current.steps[this.stepIndex.current];
  }

  constructor(
    private router: Router
  ) { }

  updateProgress(module: Module) {
    const numerator = module.steps.map(s => Number(!!s.is_checked)).reduce((prev, curr) => prev + curr);
    const denominator = module.steps.length;
    module.percComplete = Math.round(100 * numerator / denominator);
  }

  setStepFromId(id: number) {
    this.stepIndex.current = this.module.current.steps.findIndex(step => Number(step.id) === Number(id)) || 0;
  }

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
    if (step.template_component) {
      this.router.navigate(['module', this.module.current.id, 'step', step.id]);
    } else {
      return offset === 1 ? this.nextStep() : this.previousStep();
    }
  }
}
