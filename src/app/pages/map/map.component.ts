import { Component, Directive, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { interval, map, Observable, of, takeWhile } from "rxjs";
import { Membre } from "src/app/model/membre";
import { Projet } from "src/app/model/projet";
import { Role } from "src/app/model/role";
import { Sprint } from "src/app/model/sprint";
import { SprintBacklog } from "src/app/model/sprint-backlog";
import { TacheTicket } from "src/app/model/tache-ticket";
import { TicketHistoire } from "src/app/model/ticket-histoire";
import { HistoireTicketService } from "src/app/service/histoire-ticket.service";
import { MembreService } from "src/app/service/membre.service";
import { RoleService } from "src/app/service/role.service";
import { SprintBacklogService } from "src/app/service/sprint-backlog.service";
import { SprintService } from "src/app/service/sprint.service";
import { TicketTacheService } from "src/app/service/ticket-tache.service";
import { AjoutTacheSpbComponent } from "../dialogs/ajout-tache-spb/ajout-tache-spb.component";
import { GestionTacheDialogComponent } from "../dialogs/gestion-tache-dialog/gestion-tache-dialog.component";


export interface DialogDataTicketTache {
  sprintBacklog: SprintBacklog;
  ticketHistoire:TicketHistoire
}

export interface DialogGererDataTicketTache {
  ticketTache:TacheTicket
}



@Component({
  selector: "app-map",
  templateUrl: "map.component.html",
  styleUrls: ['./map.component.scss'],

})


export class MapComponent implements OnInit {
  constructor(
    private sprintService:SprintService,
    private ticketHistoireService:HistoireTicketService,
    private ticketTacheService:TicketTacheService,
    private sprintBacklogService:SprintBacklogService,
    private membreService:MembreService,
    private dialogAjout: MatDialog,
    private roleService:RoleService,
    private toastr: ToastrService,
    private dialogGestion:MatDialog
  ) {}

  sprintsList:Sprint[]
  sprintBacklogs:SprintBacklog[]=[]
  ticketsHistoireList:TicketHistoire[]
  ticketsTache:TacheTicket[]=[]
  taskMap:Map<TicketHistoire,TacheTicket[]>=new Map<TicketHistoire,TacheTicket[]>()
  listMembre:Membre[]=[]
  ticketTachePrise:TacheTicket[]
  endDate: Date = new Date('2023-03-31T23:59:59');
  roles:Role[];
  ngOnInit() {
   
    const projet:Projet = JSON.parse(localStorage.getItem('projet'))  
    this.roleService.afficherListRoleParProjet(projet.id).subscribe(
      data =>{
        // console.log(data);
        this.roles = data
        for(let role of data){
          this.listMembre.push(role.membre)
        }
      }
    ) 


    const productBacklog  = JSON.parse(localStorage.getItem('productBacklogCourant'))
    this.sprintService.getListSprintsByProductBacklog(productBacklog.id).subscribe(
      listSprintData => {
          // console.log(listSprintData);
          this.sprintsList = listSprintData
          for(let i = 0; i<listSprintData.length;i++)
            this.sprintBacklogService.afficherSprintBacklogBySprintId(listSprintData[i].id).subscribe(
              sprintBacklogData =>{
                // console.log(sprintBacklogData);
                this.sprintBacklogs.push(sprintBacklogData);

              }
            )

      }
    );
  }

  afficherDetailSprintBacklog(sprintBacklog:SprintBacklog){
      console.log(sprintBacklog.sprint.id);
      const taskMap = new Map();
      this.ticketHistoireService.getHistoireTicketBySprintId(sprintBacklog.sprint.id).subscribe(
        data => {
          this.ticketsHistoireList = data;
          for(let ht of this.ticketsHistoireList){

            this.ticketTacheService.getListTicketTacheParHt(ht.id).subscribe(
              listTacheData =>{
                this.ticketsTache = listTacheData;
                taskMap.set(ht,this.ticketsTache)
                console.log(this.ticketsTache);


              }
            )

          }
          this.taskMap = taskMap
        }
      )

  }

  //choix couleur tache
  getBackgroundColor(index: number): any {
    if (index % 2 === 0) {
      return { 'background-color': '#C8F8F3' };
    } else if (index % 3 == 0 && index % 2 == 0) {
      return { 'background-color': '#F0FCCA' };
    } else if (index % 3 == 0) {
      return { 'background-color': '#EFF8C2' };
    } else if (index % 7 == 0) {
      return { 'background-color': '#F8E7C2' };
    }else if (index == 1) {
      return { 'background-color': '#DDDAD3' };
    } else {
      return {};
    }
  }


  prendreTicket(membre:Membre,idTicketTache:number){
      this.ticketTacheService.affecterTicketAMembre(membre,idTicketTache).subscribe(
        dataTicket=>{
            this.ticketsTache.forEach(ticket=>{
              if(ticket.id == idTicketTache){
                ticket.dateFin = dataTicket.dateFin
                ticket.dateLancement = dataTicket.dateLancement
                ticket.membre = dataTicket.membre
                ticket.membreId = dataTicket.membreId
                this.toastr.success(`ce ticket est pris par le membre qui a l'email `+membre.email);
              }
            })
        }
      )
  }

  reverseIndex(index: number, length: number): number {
    return length - index;
  }

  activeIndex = -1;

  toggleAccordion(index: number) {
    if (index === this.activeIndex) {
      this.sprintBacklogs[index].isOpen = false;
      this.activeIndex = -1;
    } else {
      this.sprintBacklogs.forEach((item, i) => {
        item.isOpen = i === index ? true : false;
      });
      this.activeIndex = index;
    }
  }


  openAjoutDialog(ht:TicketHistoire,sprintBacklog:SprintBacklog){
    const dialogRef = this.dialogAjout.open(AjoutTacheSpbComponent,{
      width: '350px',
      height:'450px',
      data: {sprintBacklog:sprintBacklog,
             ticketHistoire:ht
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
      const ticketHistoire = result.ht
      for(const key of this.taskMap.keys()) {
        if (key.id === ticketHistoire.id) {
          const listeTache = this.taskMap.get(key)
          listeTache.push(result)
        }
       }
     }
    });
  }


  openGestionTache(tt:TacheTicket){

    const dialogRef = this.dialogGestion.open(GestionTacheDialogComponent,{
      width: '650px',
      height:'300px',
      data: {
        ticketTache:tt
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      if(result.mode == 'modifier'){
        console.log("test");
          for(const key of this.taskMap.keys()) {
            if (key.id === result.tt.ht.id) {
              const listeTache = this.taskMap.get(key)
              listeTache[listeTache.indexOf(tt)]=result.tt
            }
          }
      }
      else if(result.mode == 'supprimer'){
      const ticketHistoire = result.tt.ht
      for(const key of this.taskMap.keys()) {
        if (key.id === ticketHistoire.id) {
          const listeTache = this.taskMap.get(key)
          console.log(listeTache.indexOf(tt));
          listeTache.splice(listeTache.indexOf(tt),1)
        }
       }
     }
    });
  }


  checkRole(membre:Membre){
    const role = this.roles.find(role => role.membre.id === membre.id);
    return role.status == "ACCEPTE"
  }


}


