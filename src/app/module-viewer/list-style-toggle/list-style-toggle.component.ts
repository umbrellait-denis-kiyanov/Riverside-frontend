import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-style-toggle',
  templateUrl: './list-style-toggle.component.html',
  styleUrls: ['./list-style-toggle.component.sass']
})
export class ListStyleToggleComponent implements OnInit {

  @Input()
  listLink: string;

  @Input()
  gridLink: string;

  @Input()
  active: 'grid' | 'list';

  constructor() { }

  ngOnInit() {
  }

}
