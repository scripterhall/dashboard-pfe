import { Component, OnInit } from '@angular/core';
import { Membre } from 'src/app/model/membre';
import { Role } from 'src/app/model/role';
import { TacheTicket } from 'src/app/model/tache-ticket';
import { RoleService } from 'src/app/service/role.service';
import { TicketTacheService } from 'src/app/service/ticket-tache.service';
import {Chart} from 'chart.js';
import { MatDialog } from '@angular/material/dialog';
import { PerformanceCourbeComponent } from '../dialogs/performance-courbe/performance-courbe.component';


export interface PerformanceData{
  membreActuelle : Membre,
  tousLesTache:TacheTicket[],
  tacheTerminer:TacheTicket[],
  tacheEnCours:TacheTicket[],
  tacheAVerifier:TacheTicket[],
  tacheAFaire:TacheTicket[]
}

@Component({
  selector: 'app-list-membre-projet',
  templateUrl: './list-membre-projet.component.html',
  styleUrls: ['./list-membre-projet.component.scss']
})
export class ListMembreProjetComponent implements OnInit{

  listeMembreProjet:Membre[]=[]
  listeTacheMembre:TacheTicket[]
  /**filtre des tache */
  ticketTacheMembre:TacheTicket[]
  listeTacheAVerifier:TacheTicket[]=[]
  listeTacheEnCours:TacheTicket[]=[]
  listeRole:Role[]
  listeTacheTermine:TacheTicket[]=[]
  listeTacheAFaire:TacheTicket[]=[]

  /** end */

  /** map de filtrage */

  tacheAVerifierMembre:Map<Membre,TacheTicket[]> = new Map<Membre,TacheTicket[]>();
  tacheEncoursMembre:Map<Membre,TacheTicket[]> = new Map<Membre,TacheTicket[]>();
  tacheTerminerMembre:Map<Membre,TacheTicket[]> = new Map<Membre,TacheTicket[]>();
  tacheAFaireMembre:Map<Membre,TacheTicket[]> = new Map<Membre,TacheTicket[]>();


  /** end */

  constructor(
    private roleService:RoleService,
    private ticketTacheService:TicketTacheService,
    private performanceDialog:MatDialog
  ){}

  ngOnInit(): void {
    const projet = JSON.parse(localStorage.getItem('projet'))
    this.roleService.afficherListRoleParProjet(projet.id).subscribe(
      dataRoles => {
        this.listeRole = dataRoles.filter(role => role.status == "ACCEPTE")
        for(let role of dataRoles){
          if(role.status == "ACCEPTE" && role.type=="dev team")
            this.listeMembreProjet.push(role.membre)
        }
        console.log(this.listeMembreProjet);
        /** recuperer la liste des tâche */

        for(let membre of this.listeMembreProjet){
          this.ticketTacheService.getTicketsTacheByMembreId(membre.id).subscribe(
            ticketsTacheData=>{
               ticketsTacheData = ticketsTacheData.filter(tache=>
                tache.ht.productBacklogId == JSON.parse(localStorage.getItem('productBacklogCourant')).id
                )
                this.listeTacheAVerifier = ticketsTacheData.filter(tache=> tache.etat == "à verfier")
                this.listeTacheTermine = ticketsTacheData.filter(tache=> tache.etat == "terminé")
                this.listeTacheAFaire = ticketsTacheData.filter(tache=> tache.etat == "à faire")
                this.listeTacheEnCours = ticketsTacheData.filter(tache=> tache.etat == "en cours")
               /** remplissage des maps */
               this.tacheAFaireMembre.set(membre,this.listeTacheAFaire)
               this.tacheAVerifierMembre.set(membre,this.listeTacheAVerifier)
               this.tacheEncoursMembre.set(membre,this.listeTacheEnCours)
               this.tacheTerminerMembre.set(membre,this.listeTacheTermine)
               /** end */
            }
          )
        }
        /** end de recuperation  */
        console.log(this.tacheAFaireMembre);
        console.log("==============================");
        console.log(this.tacheAVerifierMembre);
        console.log("==============================");
        console.log(this.tacheEncoursMembre);
        console.log("==============================");
        console.log(this.tacheTerminerMembre);
      }
    )
  }

  chart:Chart

  openPerformanceDialog(membre:Membre){
    const tacheTerminer = this.tacheTerminerMembre.get(membre)
    const tacheEnCours = this.tacheEncoursMembre.get(membre)
    const tacheAVerifier = this.tacheAVerifierMembre.get(membre)
    const tacheAFaire = this.tacheAFaireMembre.get(membre)
    this.ticketTacheMembre = [
      ...tacheEnCours,
      ...tacheTerminer,
      ...tacheAVerifier,
      ...tacheAFaire
    ]
    const dialogRef = this.performanceDialog.open(PerformanceCourbeComponent,{
      width:'700px',
      height:'570px',
      data :{
        membreActuelle:membre,
        tousLesTache:this.ticketTacheMembre,
        tacheTerminer:tacheTerminer,
        tacheEnCours:tacheEnCours,
        tacheAVerifier:tacheAVerifier,
        tacheAFaire:tacheAFaire
      }
    })
  }


}




