import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TicketHistoire } from '../model/ticket-histoire';


const URL = "http://localhost:9999/ticket-tache-service/ticket-taches"

@Injectable({
  providedIn: 'root'
})
export class TicketTacheService {

  constructor(private http: HttpClient) { }


  public getListTicketTacheParHt(idTicketHistoire:number){
    return this.http.get<TicketHistoire[]>(`${URL}/ticket-histoire/`+idTicketHistoire);
  }




}
