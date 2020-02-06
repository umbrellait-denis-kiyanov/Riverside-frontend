import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { BuyerPersonasService } from '../services/buyer-personas.service';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'personaName'
})
export class PersonaNamePipe implements PipeTransform {
  constructor(private buyerPersonasService: BuyerPersonasService) {
  }

  transform(personaIndexes: number[]): Observable<string> {
    return this.buyerPersonasService.getBuyerPersonas().pipe(map(buyerPersonas =>
      buyerPersonas
        .filter(buyerPersona => personaIndexes.includes(buyerPersona.index))
        .map(buyerPersona => buyerPersona.name)
        .join(', ')
    ));
  }
}
