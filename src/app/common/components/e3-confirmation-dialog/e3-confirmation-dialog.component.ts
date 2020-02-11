import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { DialogType } from './e3-confirmation-dialog.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'e3-confirmation-dialog',
  templateUrl: './e3-confirmation-dialog.component.html',
  styleUrls: ['./e3-confirmation-dialog.component.sass']
})
export class E3ConfirmationDialogComponent implements OnInit {
  @Input() ok_text = 'Confirm';
  @Input() cancel_text = 'Cancel';
  @Input() content: string;
  @Input() title: string;
  @Input() type: DialogType;
  @Input() noCancel = false;

  constructor(public modal: NgbActiveModal) {}

  ngOnInit() {}
}
