import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'e3-required',
  templateUrl: './e3-required.component.html',
  styleUrls: ['./e3-required.component.sass']
})
export class E3RequiredComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() controlName: string;

  constructor() {}

  ngOnInit() {}
}
