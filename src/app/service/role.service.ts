import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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
}
