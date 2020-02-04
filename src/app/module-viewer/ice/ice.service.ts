import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class IceService {
  onApprove = new EventEmitter<boolean>(false);
  onUnapprove = new EventEmitter<boolean>(false);
  shouldShowWarning = false;
  warningText = 'This has already been approved by the managing director. Editing it will require it to be approved again.';
}
