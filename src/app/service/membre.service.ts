import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
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
}
