import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { BuyerPersonasService } from '../services/buyer-personas.service';
import { map, shareReplay } from 'rxjs/operators';
import { BuyerPersona } from '../interfaces/buyer-persona.interface';

@Pipe({
  name: 'personaName'
})
export class PersonaNamePipe implements PipeTransform {
  private buyerPersonas$: Observable<BuyerPersona[]>;

  constructor(private buyerPersonasService: BuyerPersonasService) {
    this.buyerPersonas$ = this.buyerPersonasService
      .getBuyerPersonas()
      .pipe(shareReplay(1));
  }

  transform(personaIndexes: number[]): Observable<string> {
    return this.buyerPersonas$.pipe(
      map(buyerPersonas =>
        buyerPersonas
          .filter(buyerPersona => personaIndexes.includes(buyerPersona.index))
          .map(buyerPersona => buyerPersona.name)
          .join(', ')
      )
    );
  }
}
