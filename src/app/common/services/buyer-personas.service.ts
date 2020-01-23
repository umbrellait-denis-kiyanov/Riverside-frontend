import { Injectable } from '@angular/core';
import { BuyerPersona } from "../interfaces/buyer-persona.interface";
import { Observable  } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { HttpClient  } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BuyerPersonasService {

  baseUrl = '/api/modules';
  buyerPersonas$: Observable<BuyerPersona[]> = this.getBuyerPersonas();

  constructor( private httpClient: HttpClient ) {}

  getBuyerPersonas(): Observable<BuyerPersona[]> {
    if (!this.buyerPersonas$ ) {
      this.buyerPersonas$ = this.httpClient.get<BuyerPersona[]>(`${this.baseUrl}/org/1/buyer-personas`).pipe(shareReplay(1));
    }
    return this.buyerPersonas$;
  }

}
