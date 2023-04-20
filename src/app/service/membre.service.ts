import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketHistoire } from '../model/ticket-histoire';
import { map } from 'rxjs';
import { Membre } from '../model/membre';
const URL = "http://localhost:9999/membre-service/membres"
const URL2 = "http://localhost:9999/inscription-service/auth"


@Injectable({
  providedIn: 'root'
})
export class MembreService {

  constructor(private http: HttpClient) { }

  getHistoireTicketsByMembreId(membreId: number): Observable<TicketHistoire[]> {
    return this.http.get<TicketHistoire[]>(`${URL}/${membreId}/histoiresTickets`);
  }


  afficherTousMembres(){
    return this.http.get<Membre[]>(`${URL}`,{ observe: 'response' })
    .pipe(
      map(response => {
        const membres: Membre[] = response.body;
        if(response.status ===404)
          return []
        return membres;
      }))
  }

  getMembreById(idMembre:number){
    return this.http.get<Membre>(`${URL}/`+idMembre,{ observe: 'response' })
    .pipe(
      map(response => {
        const m: Membre = response.body;
        if(response.status ===404)
          return null;
        return m;
      }));
  }
  supprimerMembre(id:number):Observable<void>{
    return this.http.delete<void>(`${URL}/`+id);
  }

  inscription(membre:Membre){
    return this.http.post<Membre>(`${URL2}/membre`,membre,{observe:'response'})
    .pipe(
      map(
        response =>{
          const membreInscris: Membre = response.body;
          if(response.status == 400)
            return null
          return membreInscris;
        }
      )
    )
  }

}
