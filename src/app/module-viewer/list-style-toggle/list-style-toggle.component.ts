import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-list-style-toggle',
  templateUrl: './list-style-toggle.component.html',
  styleUrls: ['./list-style-toggle.component.sass']
})
export class ListStyleToggleComponent implements OnInit {
  state: 'grid' | 'list';

  @Input()
  get active() {
    return this.state;
  }

  set active(state: 'grid' | 'list') {
    this.state = state;
    this.activeChange.emit(this.state);
  }

  @Output() activeChange = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
