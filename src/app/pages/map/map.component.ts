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
import Swal from "sweetalert2";


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
  showCourbe=false;
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
          listSprintData = listSprintData.filter(sprint => sprint.etat!="en attente")
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


  prendreTicket(idTicketTache:number){
    const  ticket = this.ticketsTache.find(tache=>tache.id === idTicketTache)
    Swal.fire({
      title: "vous êtes sûr de prendre la tâche : "+ticket.titre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, Lancer!',
      cancelButtonText: 'Annuler',
      background:'rgba(0,0,0,0.9)',
      backdrop: 'rgba(0,0,0,0.4)',
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      focusConfirm: false
    }).then((result) => {
      if (result.isConfirmed) {  
        const membre = JSON.parse(localStorage.getItem('membre'))
        this.ticketTacheService.affecterTicketAMembre(membre,idTicketTache).subscribe(
        dataTicket=>{
            this.ticketsTache.forEach(ticket=>{
              if(ticket.id == idTicketTache){
                ticket.dateFin = dataTicket.dateFin
                ticket.dateLancement = dataTicket.dateLancement
                ticket.membre = dataTicket.membre
                ticket.membreId = dataTicket.membreId
                Swal.fire(
                  'tâche pris',
                  'Vous êtes le responsable de cette tâche vieulliez à ce quelle soit terminé dans '+ticket.nbHeurs+"H",
                  'success'
                )
              }
            })
        }
      )
      
      }
     }      
    );
  
    
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
      height:'550px',
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
          console.log(result);
          result.ht.sprintId = result.sprintBacklog.sprintId
          result.ht.status = "EN_COURS"
          this.ticketHistoireService.updateUserStory(result.ht.id,result.ht).subscribe(
            dataHistoire =>{
              console.log(dataHistoire)
              key.status = "EN_COURS"
            }
          ) 
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
     }else if(result.mode == 'terminer'){
      const ticketHistoire = result.tt.ht
      for(const key of this.taskMap.keys()) {
        if (key.id === ticketHistoire.id) {
          const listeTache = this.taskMap.get(key)
          const listeTacheTermine = listeTache.filter(tache => tache.etat == "terminé")
          if(listeTacheTermine.length == listeTache.length){
            ticketHistoire.status = "TERMINE"
            console.log(ticketHistoire);
            
            this.ticketHistoireService.updateUserStory(ticketHistoire.id,ticketHistoire).subscribe(
              dataHistoire =>{
                console.log(dataHistoire)
                Swal.fire(
                  'Félicitation ',
                  'vous avez terminer un histoire de sprint',
                  'success'
                )
              }
            )
          }

        }

      }
     }
    });
  }


  checkRole(membre:Membre){
    const role = this.roles.find(role => role.membre.id === membre.id);
    return role.status == "ACCEPTE"
  }


  verifierPersPris(membre:Membre){
    const prendre = "cette ticket est pris par "
    if(JSON.parse(localStorage.getItem('membre')).id == membre.id)
      this.toastr.success(`${prendre} Vous 	😀`);
    else
      this.toastr.success(`${prendre} ${membre.email}`);
  }


}


