import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'e3-checkbox',
  templateUrl: './e3-checkbox.component.html',
  styleUrls: ['./e3-checkbox.component.sass']
})
export class E3CheckboxComponent implements OnInit {
  @Input() checked: boolean;
  @Input() disabled: boolean;
  @Output() checkedChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  check() {
    if (this.disabled) { return; }

    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}
