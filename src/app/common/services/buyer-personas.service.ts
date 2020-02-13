import { Injectable } from '@angular/core';
import { BuyerPersona } from "../interfaces/buyer-persona.interface";
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { HttpClient  } from '@angular/common/http';
import { ModuleNavService } from "./module-nav.service";
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class BuyerPersonasService {

  baseUrl = environment.apiRoot + '/api/modules';
  private buyerPersonas$: Observable<BuyerPersona[]>;
  dataChanged$ = new BehaviorSubject(true);

  constructor( private httpClient: HttpClient, private moduleNavService : ModuleNavService) {
    this.buyerPersonas$ = combineLatest(this.dataChanged$)
        .pipe(switchMap(_ => this.getBuyerPersonasData()));
  }

  getBuyerPersonas(){
    return this.buyerPersonas$.pipe(shareReplay(1));
  }

  getBuyerPersonasData() {
    return this.moduleNavService.organization$.pipe(switchMap(orgId =>
        this.httpClient.get<BuyerPersona[]>(`${this.baseUrl}/org/${orgId}/buyer-personas`)
    ));
  }
}
