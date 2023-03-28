import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Membre } from '../model/membre';

const URL = 'http://localhost:9999/membre-service/membres'

@Injectable({
  providedIn: 'root'
})
export class MembreService {

  constructor(private http:HttpClient) { }

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

}
