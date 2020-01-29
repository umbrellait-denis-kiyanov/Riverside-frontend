import { Injectable } from '@angular/core';
import { BuyerPersona } from "../interfaces/buyer-persona.interface";
import { Observable  } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { HttpClient  } from '@angular/common/http';
import { ModuleNavService } from "./module-nav.service";

@Injectable({
  providedIn: 'root'
})

export class BuyerPersonasService {

  baseUrl = '/api/modules';
  buyerPersonas$: Observable<BuyerPersona[]>

  constructor( private httpClient: HttpClient, private moduleNavService : ModuleNavService) {
    this.buyerPersonas$ = this.getBuyerPersonas();
  }

  getBuyerPersonas() {
    if(!this.buyerPersonas$){
      return this.moduleNavService.organization$.pipe(switchMap(orgId =>
        this.httpClient.get<BuyerPersona[]>(`${this.baseUrl}/org/${orgId}/buyer-personas`).pipe(shareReplay(1))
      ))
    }
  }
}