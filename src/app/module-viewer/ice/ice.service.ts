import { Injectable } from '@angular/core';
import { IceComponent } from './ice.component';

@Injectable()
export class IceService {
  allComponents: IceComponent[] = [];

  closeAll() {
    this.allComponents.forEach(c => c.closeComment());
  }
}
