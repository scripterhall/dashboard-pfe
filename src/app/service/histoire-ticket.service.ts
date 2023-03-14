import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketHistoire } from '../model/ticket-histoire';
const url1 = "http://localhost:9999/gestion-histoire-ticket/histoireTickets"

@Injectable({
  providedIn: 'root'
})
export class HistoireTicketService {
private url1 = "http://localhost:9999/gestion-histoire-ticket/histoireTickets"

  constructor(private http: HttpClient) { }

  public getListHistoireTicketByProductBacklog(productBacklogId:number){
    return this.http.get<TicketHistoire[]>(`${url1}/productBacklog/`+productBacklogId);
  }

  addTicket(ticket: TicketHistoire): Observable<TicketHistoire> {
    return this.http.post<TicketHistoire>(`${url1}`,ticket);
  }

  public getListHistoireTicketByProjet(projetId:number){
    return this.http.get<TicketHistoire[]>(`${url1}/projet/`+projetId);
  }

}
