import { Injectable, EventEmitter } from '@angular/core';
import { IceComponent } from './ice.component';
import { ModuleNavService } from 'src/app/common/services/module-nav.service';

@Injectable()
export class IceService {
  allComponents: IceComponent[] = [];
  onApprove = new EventEmitter<boolean>(false);
  onUnapprove = new EventEmitter<boolean>(false);
  shouldShowWarning = false;
  warningText = 'warning!';

  closeAll() {
    this.allComponents.forEach(c => c.closeComment());
  }
}
