import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Invitation } from '../model/invitation';
import { Projet } from '../model/projet';

const URL = 'http://localhost:9999/invitation-service/invitations'

interface Request {
  invitation: Invitation;
  projet: Projet;
}

@Injectable({
  providedIn: 'root'
})
export class InvitationService {

  constructor(private http:HttpClient) { }

  envoyerInvitation(request:Request){
    return this.http.post<Invitation>(URL+"/invitation",request);
  }

}
