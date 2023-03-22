import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Membre } from '../model/membre';
import { TacheTicket } from '../model/tache-ticket';



const URL = "http://localhost:9999/ticket-tache-service/ticket-taches"

@Injectable({
  providedIn: 'root'
})
export class TicketTacheService {

  constructor(private http: HttpClient) { }


   getListTicketTacheParHt(idTicketHistoire:number):Observable<TacheTicket[]>{
    return this.http.get<TacheTicket[]>(`${URL}/ticket-histoire/${idTicketHistoire}`,{ observe: 'response' })
    .pipe(
      map(response => {
        const ticketTache: TacheTicket[] = response.body;
        if(response.status ===404)
          return []
        return ticketTache;
      })
    );
  }

   ajouterTicketTache(tt:TacheTicket): Observable<TacheTicket> {
    return this.http.post<TacheTicket>(`${URL}`, tt, { observe: 'response' })
      .pipe(
        map(response => {
          const createdTacheTicket: TacheTicket = response.body;
          console.log(response.status);
          if(response.status === 404) {
            return null;
          }
          return createdTacheTicket;
        })
      );
   }

  supprimerTicketTache(id:number):Observable<void>{
    return this.http.delete<void>(`${URL}/`+id);
  }

  modifierTicketTache(ticketTache:TacheTicket): Observable<TacheTicket>{
    return this.http.put<TacheTicket>(`${URL}`,ticketTache ,{ observe: 'response' })
    .pipe(
      map(response => {
        const modifiedTicket: TacheTicket = response.body;
        if(response.status === 404) {
          return null;
        }
        return modifiedTicket;
      })
    );
  }


  affecterTicketAMembre(membre:Membre,idTicket:number){
      return this.http.put<TacheTicket>(`${URL}/`+idTicket,membre,{ observe: 'response' })
      .pipe(
        map(response => {
          const modifiedTicket: TacheTicket = response.body;
          if(response.status === 404) {
            return null;
          }
          return modifiedTicket;
        })
      );
  }


}
