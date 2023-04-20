import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ChefProjet } from '../model/chef-projet';

const url1 = "http://localhost:9999/gestion-chefProjet-service/chef-projets"
const URL2 = "http://localhost:9999/inscription-service/auth"

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

  inscription(chef:ChefProjet){
    return this.http.post<ChefProjet>(`${URL2}/chef-projet`,chef,{observe:'response'})
    .pipe(
      map(
        response =>{
          const chefInscris: ChefProjet = response.body;
          if(response.status == 400)
            return null
          return chefInscris;
        }
      )
    )
  }
}
