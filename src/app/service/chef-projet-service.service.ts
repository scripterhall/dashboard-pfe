import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ChefProjet } from '../model/chef-projet';

const url1 = "http://localhost:9999/gestion-chefProjet-service/chef-projets"

@Injectable({
  providedIn: 'root'
})
export class ChefProjetServiceService {

  constructor(private http: HttpClient) { }

  public getChefProjetById(idChef:number){
    return this.http.get<ChefProjet>(`${url1}/`+idChef,{ observe: 'response' })
    .pipe(
      map(response => {
        
        const chef: ChefProjet = response.body;
        if(response.status ===404)
          return null;
        return chef;
      }));
  }


}
