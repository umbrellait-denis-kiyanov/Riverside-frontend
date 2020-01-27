import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BuyerPersonasService } from "../../../../common/services/buyer-personas.service";
import { BuyerPersona } from "../../../../common/interfaces/buyer-persona.interface";
import { Observable, combineLatest } from 'rxjs';

@Component({
  host: {
    '(document:click)': 'clickOut($event)',
  },
  selector: 'buyer-personas-selector',
  templateUrl: './buyer-personas-selector.component.html',
  styleUrls: ['./buyer-personas-selector.component.sass']
})
export class BuyerPersonasSelectorComponent implements OnInit {

  buyerPersonas$: Observable<BuyerPersona[]>;
  personasList : BuyerPersona[];
  @Input () readonly : boolean = false;
  @Input () personas : number[] = [];
  @Output() onChange = new EventEmitter<void>();
  selectedPersonasInit : number[] = [];
  constructor( private buyerPersonasService: BuyerPersonasService ) { }

  ngOnInit() {
    this.personas.map(persona =>
      this.selectedPersonasInit.push(persona)
    );
    this.buyerPersonasService.buyerPersonas$.subscribe(buyerPersonas =>
      this.updatePersonas(buyerPersonas)
    );
  }

  updatePersonas(buyerPersonas : BuyerPersona[]){
    this.personasList = buyerPersonas;
    if(this.personas != this.selectedPersonasInit){
      //Empty personas array and fill it again with the initial values
      this.personas.length = 0;
      this.selectedPersonasInit.map(persona =>
        this.personas.push(persona)
      );
      this.onChange.emit();
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
  getReadOnlyTitles(){
    let readOnlyTitles = "";
    if(this.personasList){
      this.personasList.forEach(persona => {
        if(this.personas.indexOf(persona.index) > -1 ){
          readOnlyTitles += persona.title + ", ";
        }
      });
    }
    if(!readOnlyTitles){
      return "No personas selected";
    }else{
      return readOnlyTitles.substr(0, readOnlyTitles.length -2);
    }
  }
}
