import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductBacklog } from '../model/product-backlog';
import { TicketHistoire } from '../model/ticket-histoire';
const url1 = "http://localhost:9999/gestion-product-backlog/product-backlogs"

@Injectable({
  providedIn: 'root'
})
export class ProductBacklogService {
  constructor(private http: HttpClient) { }

  public getProductBacklogById(productBacklogId:number){
    return this.http.get<ProductBacklog[]>(`${url1}/`+productBacklogId);
  }

  public getProductBacklogByIdProjet(idProjet: number) {
    const url = `${url1}/projet/${idProjet}`;
    return this.http.get<ProductBacklog>(url);
  }

  getHistoireTicketsByProductBacklogId(productBacklogId: number): Observable<TicketHistoire[]> {
    return this.http.get<TicketHistoire[]>(`${url1}/${productBacklogId}/histoiresTickets`);
  }
}
