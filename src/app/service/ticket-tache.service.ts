import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TacheTicket } from '../model/tache-ticket';
import { TicketHistoire } from '../model/ticket-histoire';


const URL = "http://localhost:9999/ticket-tache-service/ticket-taches"

@Injectable({
  providedIn: 'root'
})
export class TicketTacheService {

  constructor(private http: HttpClient) { }


   getListTicketTacheParHt(idTicketHistoire:number){
    return this.http.get<TicketHistoire[]>(`${URL}/ticket-histoire/`+idTicketHistoire);
  }

   ajouterTicketTache(tt:TacheTicket){
    return this.http.post<TacheTicket>(`${URL}`,tt);
  }

  supprimerTicketTache(id:number){
    return this.http.delete<TacheTicket>(`${URL}/`+id);
  }

  modifierTicketTache(ticketTache:TacheTicket){
    return this.http.put<TacheTicket>(`${URL}`,ticketTache);
  }


}
