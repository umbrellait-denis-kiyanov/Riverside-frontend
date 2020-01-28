import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BuyerPersonasService } from "../../../../common/services/buyer-personas.service";
import { Observable, combineLatest, observable } from 'rxjs';
import { map  } from "rxjs/operators";

@Component({
  host: {
    '(document:click)': 'clickOut($event)',
  },
  selector: 'buyer-personas-selector',
  templateUrl: './buyer-personas-selector.component.html',
  styleUrls: ['./buyer-personas-selector.component.sass']
})
export class BuyerPersonasSelectorComponent implements OnInit {

  constructor( private buyerPersonasService: BuyerPersonasService ) { }

  @Input () readonly : boolean = false;
  @Input () personas : number[] = [];
  @Output() onChange = new EventEmitter<void>();
  readOnlyTitles$: Observable<string>;

  ngOnInit() {
    if(this.readonly){
      this.getReadOnlyTitles();
    }
  }

  selectBuyerPersona($event, index : number) {
    $event.stopPropagation();
    if(this.personas.indexOf(index) > -1){
      this.personas.splice(this.personas.indexOf(index),1); //Remove selected persona
    }else{
      this.personas.push(index); //Add selected persona
    }
    this.onChange.emit();
  }

  clickOut($event, listClicked : HTMLElement) {
    document.querySelectorAll('.buyerPersonasList').forEach(element => {
      let dropdown: HTMLElement = element as HTMLElement;
      if(dropdown != listClicked){
        //Avoid to close the current dropdown
        dropdown.style.display = "none";
      }
    });
  }

  openDropdown($event){
    let buyerPersonasList : HTMLElement = this.getBPListElement($event.toElement) as HTMLElement;
    if (buyerPersonasList.style.display != "block" ) {
      buyerPersonasList.style.display = "block";
      //Close other dropdowns when click a buyer personas selector
      $event.stopPropagation();
      this.clickOut(null,buyerPersonasList);
    }
  }

  getBPListElement(currentElement : HTMLElement){
    if(currentElement.className.indexOf("bpSelect") > -1){
      return currentElement.nextElementSibling;
    }else{
      return this.getBPListElement(currentElement.parentElement);
    }
  }

  //Show personas selected titles only in case it's read only
  getReadOnlyTitles() {
   this.readOnlyTitles$ =  this.buyerPersonasService.buyerPersonas$.pipe(map(personas => personas
    .filter(persona => this.personas.indexOf(persona.index) > -1)
    .map(persona => persona.name)
    .join(', ') || 'No personas selected'));
  }
}
