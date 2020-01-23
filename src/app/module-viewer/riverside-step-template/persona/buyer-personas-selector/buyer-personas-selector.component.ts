import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BuyerPersonasService } from "../../../../common/services/buyer-personas.service";
import { BuyerPersona } from "../../../../common/interfaces/buyer-persona.interface";
import { Observable, combineLatest } from 'rxjs';

@Component({
  host: {
    '(document:click)': 'onClick($event)',
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

  constructor( private buyerPersonasService: BuyerPersonasService ) { }

  ngOnInit() {
    this.buyerPersonasService.buyerPersonas$.subscribe(buyerPersonas =>
      this.personasList = buyerPersonas
    );
  }

  selectBuyerPersona($event, index : number) {
    console.log(this.personas);
    $event.stopPropagation();
    if(this.personas.indexOf(index) > -1){
      this.personas.splice(this.personas.indexOf(index),1); //Remove selected persona
    }else{
      this.personas.push(index); //Add selected persona
    }
    console.log(this.personas);
  }

  onClick() {
    document.querySelectorAll('.buyerPersonasList').forEach(element => {
      let dropdown: HTMLElement = element as HTMLElement;
      dropdown.style.display = "none";
    });
  }

  openDropdown($event){
    let buyerPersonasList : HTMLElement = this.getBPListElement($event.toElement) as HTMLElement;
    if (buyerPersonasList.style.display != "block" ) {
      buyerPersonasList.style.display = "block";
      $event.stopPropagation();
    }
  }

  getBPListElement(currentElement : HTMLElement){
    console.log(currentElement);
    if(currentElement.className.indexOf("bpSelect") > -1){
      return currentElement.nextElementSibling;
    }else{
      return this.getBPListElement(currentElement.parentElement);
    }
  }

  //Show personas selected titles only in case it's read only
  getReadOnlyTitles(){
    let readOnlyTitles = "";
    this.personasList.forEach(persona => {
      if(this.personas.indexOf(persona.index) > -1 ){
        readOnlyTitles += persona.title + ", ";
      }
    });
    if(!readOnlyTitles){
      return "No personas selected";
    }else{
      return readOnlyTitles.substr(0, readOnlyTitles.length -2);
    }
  }
}
