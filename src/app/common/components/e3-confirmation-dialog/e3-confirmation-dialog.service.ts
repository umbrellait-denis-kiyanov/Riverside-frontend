import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { E3ConfirmationDialogComponent } from './e3-confirmation-dialog.component';

export type DialogType = 'warning' | 'success';

export interface OpenDialogOptions {
  ok_text?: string;
  cancel_text?: string;
  title?: string;
  content: string;
  noCancel?: boolean;
  type?: DialogType;
  onClose?: () => void;
  onCancel?: () => void;
  component?: typeof E3ConfirmationDialogComponent;
}
@Injectable()
export class E3ConfirmationDialogService {
  private defaults: Partial<OpenDialogOptions> = {
    component: E3ConfirmationDialogComponent
  };

  constructor(
    private modalService: NgbModal
  ) { }

  open(options: OpenDialogOptions) {
    options = { ...this.defaults, ...options };
    const modalRef = this.modalService.open(options.component);
    Object.keys(options).forEach(option => {
      if (!(typeof options[option] === 'function')) {
        modalRef.componentInstance[option] = options[option];
      }
    });
    options.onClose && modalRef.result.then(_ => options.onClose());
    options.onCancel && modalRef.result.catch(_ => options.onCancel());
  }
}
