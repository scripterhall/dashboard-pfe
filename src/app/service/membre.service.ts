import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TicketHistoire } from '../model/ticket-histoire';

const URL = "http://localhost:9999/membre-service/membres"
// /{membreId}/histoiresTickets
@Injectable({
  providedIn: 'root'
})
export class MembreService {

  constructor(private http: HttpClient) { }

  getHistoireTicketsByMembreId(membreId: number): Observable<TicketHistoire[]> {
    return this.http.get<TicketHistoire[]>(`${URL}/${membreId}/histoiresTickets`);
  }

}
