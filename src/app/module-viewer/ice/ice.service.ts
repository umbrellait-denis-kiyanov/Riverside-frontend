import { Injectable, EventEmitter } from '@angular/core';
import { IceComponent } from './ice.component';

@Injectable()
export class IceService {
  allComponents: IceComponent[] = [];
  onApprove = new EventEmitter<boolean>(false);

  closeAll() {
    this.allComponents.forEach(c => c.closeComment());
  }
}
