import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Projet } from '../model/projet';

const url1 = "http://localhost:9999/initialiser-projet-service/projets"

@Injectable({
  providedIn: 'root'
})
export class ProjetServiceService {

  

  constructor(private http: HttpClient) { }

  public getListProjetChefProjet(idChef:number){
    return this.http.get<Projet[]>(`${url1}/chefProjets/`+idChef);
  }
}
