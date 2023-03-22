import { Component, Directive, OnInit } from "@angular/core";
import { interval, map, Observable, of, takeWhile } from "rxjs";
import { Membre } from "src/app/model/membre";
import { Sprint } from "src/app/model/sprint";
import { SprintBacklog } from "src/app/model/sprint-backlog";
import { TacheTicket } from "src/app/model/tache-ticket";
import { TicketHistoire } from "src/app/model/ticket-histoire";
import { HistoireTicketService } from "src/app/service/histoire-ticket.service";
import { MembreService } from "src/app/service/membre.service";
import { SprintBacklogService } from "src/app/service/sprint-backlog.service";
import { SprintService } from "src/app/service/sprint.service";
import { TicketTacheService } from "src/app/service/ticket-tache.service";



interface Marker {
lat: number;
lng: number;
label?: string;
draggable?: boolean;
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
    private membreService:MembreService
  ) {}
  
  sprintsList:Sprint[]
  sprintBacklogs:SprintBacklog[]=[]
  ticketsHistoireList:TicketHistoire[]
  ticketsTache:TacheTicket[]=[]
  taskMap:Map<TicketHistoire,TacheTicket[]>=new Map<TicketHistoire,TacheTicket[]>()
  listMembre:Membre[]
  ticketTachePrise:TacheTicket[]
  endDate: Date = new Date('2023-03-31T23:59:59'); 

  ngOnInit() {
    this.membreService.afficherTousMembres().subscribe(
      data => {
        this.listMembre = data
      }
    )
    const productBacklog  = JSON.parse(localStorage.getItem('productBacklog'))
    this.sprintService.getListSprintsByProductBacklog(productBacklog.id).subscribe(
      listSprintData => {
          console.log(listSprintData);
          this.sprintsList = listSprintData
          for(let i = 0; i<listSprintData.length;i++)
            this.sprintBacklogService.afficherSprintBacklogBySprintId(listSprintData[i].id).subscribe(
              sprintBacklogData =>{
                console.log(sprintBacklogData);
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
      return { 'background-color': '#EEBF32' };
    } else if (index % 3 === 0 && index % 2 === 0) {
      return { 'background-color': '#B3BD51' };
    } else if (index % 3 === 0) {
      return { 'background-color': '#D7CD52' };
    } else if (index % 7 === 0) {
      return { 'background-color': '#DDDAD3' };
    }else if (index === 1) {
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
}
  
   
