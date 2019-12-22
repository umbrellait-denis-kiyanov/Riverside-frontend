import { Injectable, EventEmitter } from '@angular/core';
import { IceComponent } from './ice.component';

@Injectable()
export class IceService {
  allComponents: IceComponent[] = [];
  onApprove = new EventEmitter<boolean>(false);
  onUnapprove = new EventEmitter<boolean>(false);
  shouldShowWarning = false;
  warningText = 'This has already been approved by the managing director. Editing it will require it to be approved again.';

  closeAll() {
    this.allComponents.forEach(c => c.closeComment());
  }
}
