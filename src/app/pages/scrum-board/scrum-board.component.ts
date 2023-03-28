import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Sprint } from 'src/app/model/sprint';
import { TacheTicket } from 'src/app/model/tache-ticket';
import { ProductBacklogService } from 'src/app/service/product-backlog.service';
import { SprintService } from 'src/app/service/sprint.service';
import { TicketTacheService } from 'src/app/service/ticket-tache.service';
import Sortable from 'sortablejs';

@Component({
  selector: 'app-scrum-board',
  templateUrl: './scrum-board.component.html',
  styleUrls: ['./scrum-board.component.scss']
})
export class ScrumBoardComponent implements OnInit {
  staticAlertClosed  = false;
  staticAlertClosed1 = false;
  staticAlertClosed2 = false;
  staticAlertClosed3 = false;
  staticAlertClosed4 = false;
  staticAlertClosed5 = false;
  staticAlertClosed6 = false;
  staticAlertClosed7 = false;


  constructor(private toastr: ToastrService, private ticketTacheService:TicketTacheService,
    private productBacklogService:ProductBacklogService, private sprintService:SprintService,
    ) {}

  ticketsTache: TacheTicket[]=[];
  sprints:Sprint[];
  movedElementId: string = '';
  etat:string;
  lastEtat:string;

  showNotification(from, align){

    const color = Math.floor((Math.random() * 5) + 1);

    switch(color){
      case 1:
      this.toastr.info('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> Welcome to <b>Black Dashboard Angular</b> - a beautiful freebie for every web developer.', '', {
         disableTimeOut: true,
         closeButton: true,
         enableHtml: true,
         toastClass: "alert alert-info alert-with-icon",
         positionClass: 'toast-' + from + '-' +  align
       });
      break;
      case 2:
      this.toastr.success('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> Welcome to <b>Black Dashboard Angular</b> - a beautiful freebie for every web developer.', '', {
         disableTimeOut: true,
         closeButton: true,
         enableHtml: true,
         toastClass: "alert alert-success alert-with-icon",
         positionClass: 'toast-' + from + '-' +  align
       });
      break;
      case 3:
      this.toastr.warning('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> Welcome to <b>Black Dashboard Angular</b> - a beautiful freebie for every web developer.', '', {
         disableTimeOut: true,
         closeButton: true,
         enableHtml: true,
         toastClass: "alert alert-warning alert-with-icon",
         positionClass: 'toast-' + from + '-' +  align
       });
      break;
      case 4:
      this.toastr.error('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> Welcome to <b>Black Dashboard Angular</b> - a beautiful freebie for every web developer.', '', {
         disableTimeOut: true,
         enableHtml: true,
         closeButton: true,
         toastClass: "alert alert-danger alert-with-icon",
         positionClass: 'toast-' + from + '-' +  align
       });
       break;
       case 5:
       this.toastr.show('<span class="tim-icons icon-bell-55" [data-notify]="icon"></span> Welcome to <b>Black Dashboard Angular</b> - a beautiful freebie for every web developer.', '', {
          disableTimeOut: true,
          closeButton: true,
          enableHtml: true,
          toastClass: "alert alert-primary alert-with-icon",
          positionClass: 'toast-' + from + '-' +  align
        });
      break;
      default:
      break;
    }
}

ngOnInit() {
  this.sprintService.getListSprintsByProductBacklog(this.productBacklogService.getProductBacklogByIdFromLocalStorage()).subscribe(
    data => {
      this.sprints = data ;
    }
  );
}

getTicketsTacheBySprint(sprintId: number) {
  if (sprintId) {
    this.ticketTacheService.getTicketsTacheBySprint(sprintId).subscribe(tickets => {
      this.ticketsTache = tickets;
      console.log(this.ticketsTache);
    });
  } else {
    this.ticketsTache = null;
  }
}

ngAfterViewInit() {
  const cardBodies = document.querySelectorAll('.card-body');
  const myArray = Array.from(cardBodies);
  for (const body of myArray) {
  const sortable = new Sortable(body, {
  group: 'shared',
  animation: 150,
  onEnd: (evt) => {
  console.log('Moved item', evt.item, 'from index', evt.oldIndex, 'to index', evt.newIndex);
  console.log('Target element ID:',evt.to.id);
  }
  });
  }
  }

  onDrop(event: DragEvent, tache: any) {
    const targetElement = event.target as Element;
    const containerElement = targetElement.closest('.card-body') as HTMLElement;
    const containerId = containerElement.getAttribute('id');
    console.log('Nouvel etat du ticket tâche: ', containerId);
    tache.etat = containerId;
    this.ticketTacheService.modifierTicketTache(tache).subscribe(
        (modifiedTicket: TacheTicket) => {
            console.log('Ticket tâche déplacé:', modifiedTicket);
        },
        (error: any) => {
            console.error('Erreur: ', error);
        });
  }

}


