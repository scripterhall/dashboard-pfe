import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { RolePk } from '../model/keys/role-pk';
import { Role } from '../model/role';

const URL = "http://localhost:9999/invitation-service/roles"

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http:HttpClient) { }

  ajouterRole(role:Role):Observable<Role>{
    return this.http.post<Role>(`${URL}`, role, { observe: 'response' })
      .pipe(
        map(response => {
          const createdRole: Role = response.body;
          console.log(response.status);
          if(response.status === 404) {
            return null;
          }
          return createdRole;
        })
      );
  }

  afficherRole(pk:RolePk):Observable<Role>{
    return this.http.post(`${URL}/role`,pk,{observe:'response'})
    .pipe(
      map(response=>{
        const roleRecup:Role = response.body
        if(response.status === 404)
          return null
        return roleRecup 
      })
    )
  }

  supprimerRole(id:RolePk,idChef:number):Observable<void>{
    console.log(idChef);
    let params = new HttpParams()
    .set('rolePk', JSON.stringify(id))
    .set('idchef',idChef.toString())
    return this.http.delete<void>(`${URL}`,{params:params});
  }

  afficherListRoleParProjet(idProjet:number){
    return this.http.get<Role[]>(`${URL}/projets/`+idProjet,{observe:'response'})
    .pipe(
      map(response =>{
        const roleListe :Role[] = response.body
        if(response.status === 404)
          return null
        if(response.status === 500)
          return null
        return roleListe
      })
    )
  }

  modifierRole(role:Role){
    return this.http.put<Role>(`${URL}`,role,{observe:'response'})
    .pipe(
      map(response => {
        const role :Role = response.body
        if(response.status === 400)
          return null
        return role
      })
    )
  }


  afficherListRoleParMembre(idMembre:number){
    return this.http.get<Role[]>(`${URL}/membres/`+idMembre,{observe:'response'})
    .pipe(
      map(response =>{
        const roleListe :Role[] = response.body
        if(response.status === 404)
          return null
        if(response.status === 500)
          return null
        return roleListe
      })
    )
  }
  




}
