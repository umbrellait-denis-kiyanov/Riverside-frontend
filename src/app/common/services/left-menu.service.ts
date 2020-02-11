import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LeftMenuService {
  onExpand: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  set expand(value: boolean) {
    this.onExpand.next(value);
  }
  get expand() {
    return this.onExpand.getValue();
  }

  constructor() {}
}
