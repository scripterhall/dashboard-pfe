import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Sprint } from '../model/sprint';
const url1 = "http://localhost:9999/gestion-sprints-service/sprints"

@Injectable({
  providedIn: 'root'
})
export class SprintService {

  constructor(private http: HttpClient) { }

  public getListSprintsByProductBacklog(productBacklogId:number){
    return this.http.get<Sprint[]>(`${url1}/productBacklog/`+productBacklogId);
  }

  public createSprint(sprint: Sprint, productBacklogId: number): Observable<Sprint> {
    return this.http.post<Sprint>(`${url1}?productBacklogId=${productBacklogId}`, sprint);
  }

}
