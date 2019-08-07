import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-persona-picture-list',
  templateUrl: './persona-picture-list.component.html',
  styleUrls: ['./persona-picture-list.component.sass']
})
export class PersonaPictureListComponent implements OnInit {

  params: any;
  list = [
    'https://www.w3schools.com/w3images/avatar6.png',
    'https://www.w3schools.com/w3images/avatar2.png',
    'https://www.w3schools.com/w3images/avatar3.png',
    'https://www.w3schools.com/w3images/avatar4.png',
    'https://www.w3schools.com/w3images/avatar5.png'
  ];
  selected: string;

  constructor(
    public modal: NgbActiveModal,
  ) { }

  ngOnInit() {
  }

  select(item: string) {
    this.selected = item;
  }

  done() {
    this.modal.close(this.selected);
  }

}
