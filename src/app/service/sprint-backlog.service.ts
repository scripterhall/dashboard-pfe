import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SprintBacklog } from '../model/sprint-backlog';

const URL = "http://localhost:9999/sprint-backlog-service/sprint-backlogs"
@Injectable({
  providedIn: 'root'
})
export class SprintBacklogService {

  constructor(private http:HttpClient) { }


  genererSprintBacklog(sprintBacklog:SprintBacklog){
    return this.http.post<SprintBacklog>(`${URL}`,sprintBacklog)
  }

  modifierSprintBackog(sprintBacklog:SprintBacklog){
    return this.http.put<SprintBacklog>(`${URL}`,sprintBacklog)
  }

  afficherSprintBacklogsByProjet(){}

  

}
