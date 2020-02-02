import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { BuyerPersonasService } from '../../../../common/services/buyer-personas.service';
import { BuyerPersona } from '../../../../common/interfaces/buyer-persona.interface';
import { Observable, combineLatest, of, observable, concat } from 'rxjs';
import { map, startWith   } from 'rxjs/operators';

@Component({
  host: {
    '(document:click)': 'hideDropdown($event)',
  },
  selector: 'buyer-personas-selector',
  templateUrl: './buyer-personas-selector.component.html',
  styleUrls: ['./buyer-personas-selector.component.sass']
})
export class BuyerPersonasSelectorComponent implements OnInit {

  @Input () readonly = false;
  @Input () selected : number[] = [];
  @Output() onChange = new EventEmitter<void>();
  readOnlyTitles$: Observable<string>;
  buyerPersonasList$: Observable<BuyerPersona[]>
  dropdownOpen = false;

  constructor( private buyerPersonasService: BuyerPersonasService, private eRef: ElementRef) { }

  ngOnInit() {
    this.buyerPersonasList$ = combineLatest(
      this.buyerPersonasService.getBuyerPersonas(),
      this.onChange.pipe(startWith(null))
    ).pipe(
      map(([buyerPersonas]) => buyerPersonas.map((persona: BuyerPersona & {isSelected: boolean}) => {
        persona.isSelected = this.selected.includes(persona.index);
        return persona;
      }))
    )
    //Show personas selected titles only in case it's read only
    this.readOnlyTitles$ =  this.buyerPersonasList$.pipe(map(personas => personas
      .filter(persona => this.selected.includes(persona.index))
      .map(persona => persona.name)
      .join(', ') || 'No personas selected'));
  }

  selectBuyerPersona(index : number) {
    if(this.selected.includes(index)){
      this.selected.splice(this.selected.indexOf(index),1); //Remove selected persona
    }else{
      this.selected.push(index); //Add selected persona
    }
    this.onChange.emit();
  }

  hideDropdown(event) {
    if(!this.eRef.nativeElement.contains(event.target)){
      this.dropdownOpen = false;
    }
  }
}
