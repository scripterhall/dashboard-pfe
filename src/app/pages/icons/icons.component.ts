import { animate, state, style, transition, trigger } from "@angular/animations";
import { CdkDragDrop, CdkDragEnd, CdkDragExit, CdkDragStart, CdkDropList, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, HostBinding, OnInit, ViewChild } from "@angular/core";
import { Sprint } from "src/app/model/sprint";
import { TicketHistoire } from "src/app/model/ticket-histoire";
import { HistoireTicketService } from "src/app/service/histoire-ticket.service";
import { SprintService } from "src/app/service/sprint.service";
import { MatDialog } from '@angular/material/dialog';
import { AjouterTicketHistoireFormComponent } from "../ajouter-ticket-histoire-form/ajouter-ticket-histoire-form.component";
import { AjouterSprintFormComponent } from "../ajouter-sprint-form/ajouter-sprint-form.component";
import { MembreService } from "src/app/service/membre.service";
import { ProductBacklog } from "src/app/model/product-backlog";
import { ProductBacklogService } from "src/app/service/product-backlog.service";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { Observable } from "rxjs";
import { ConfirmDialogDeleteUserStoryComponent } from "../confirm-dialog-delete-user-story/confirm-dialog-delete-user-story.component";
import { ConfirmAddUserStoryDialogueComponent } from "../confirm-add-user-story-dialogue/confirm-add-user-story-dialogue.component";

const  updateTicketPositionUrl = "http://localhost:9999/gestion-histoire-ticket/histoireTickets/position";

@Component({
  selector: "app-icons",
  templateUrl: "icons.component.html",
  styleUrls: ['./icons.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-in-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('fadeOut', [
      transition(':enter', [
        style({ width:  '*'}),
        animate('2.5s ease-in', style({ width: '*'}))
      ])
    ]),
    trigger('slideIn', [
      state('in', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
      ])
    ]),
    trigger('slideInSprint', [
      state('in', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(12%)' }),
        animate('0.6s ease-in-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate('0.6s ease-in-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]

})

export class IconsComponent implements OnInit {
  constructor(private histoireTicketService:HistoireTicketService,private httpClient:HttpClient,
    private sprintService:SprintService, private dialog: MatDialog,
    private membreService:MembreService, private productBacklogService:ProductBacklogService) {}

  sprints:Sprint[];
  histoireTicketsByMembreId:TicketHistoire[];
  productBacklog: ProductBacklog;
  histoireTicketsByProductBacklogId:TicketHistoire[];
  ticket:TicketHistoire;
  histoireTicket: TicketHistoire;
  newProductBacklogId: number;
  // drop(event: CdkDragDrop<TicketHistoire[]>) {

  //     const ticketId = event.previousContainer.data[event.previousIndex].id; // récupère l'ID du ticket
  //     const newPosition = event.currentIndex; // récupère la nouvelle position
  //     console.log("id = "+ticketId+", new Position = "+newPosition);
  //     this.httpClient.put(updateTicketPositionUrl, { id: ticketId, position: newPosition })
  //       .subscribe(
  //         response => console.log('Position updated successfully!'),
  //         error => console.error('Error updating position: ', error)
  //       );
  //     transferArrayItem(event.previousContainer.data,
  //                       event.container.data,
  //                       event.previousIndex,
  //                       event.currentIndex);
  // }

  // drop(event: CdkDragDrop<TicketHistoire[]>) {
  //   const ticketId = event.previousContainer.data[event.previousIndex].id; // récupère l'ID du ticket
  //   const newPosition = event.currentIndex; // récupère la nouvelle position

  //   // Si l'élément est déposé sur le premier tableau
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //     console.log("id = "+ticketId+", new Position = "+newPosition);
  //     this.httpClient.put(updateTicketPositionUrl, { id: ticketId, position: newPosition })
  //       .subscribe(
  //         response => console.log('Position updated successfully!'),
  //         error => console.error('Error updating position: ', error)
  //       );
  //     transferArrayItem(event.previousContainer.data,
  //                       event.container.data,
  //                       event.previousIndex,
  //                       event.currentIndex);
  //   }
  //   // Si l'élément est déposé sur le deuxième tableau
  //   else {
  //     const item = event.previousContainer.data[event.previousIndex];
  //     transferArrayItem(event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex);

  //     // Mettre à jour les données ou déclencher des actions en fonction du déplacement de l'élément
  //     console.log("Elémént déplacé: ", item);

  //   // Vérifier si le productBacklogId est différent de null
  //   if (item.productBacklogId !== null) {
  //     const dialogRef = this.dialog.open(ConfirmAddUserStoryDialogueComponent, {
  //       data: { item: item },
  //     });
  //   }

  //     // Appeler la méthode pour affecter l'histoire de ticket au product backlog
  //     const productBacklogId = this.getProductBacklogByIdFromLocalStorage();
  //     this.assignUserStoryToProductBacklog(item.id, productBacklogId);
  //   }
  // }

  drop(event: CdkDragDrop<TicketHistoire[]>) {
    const ticketId = event.previousContainer.data[event.previousIndex].id; // récupère l'ID du ticket
    const newPosition = event.currentIndex; // récupère la nouvelle position

    // Si l'élément est déposé sur le premier tableau
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      console.log("id = "+ticketId+", new Position = "+newPosition);
      this.httpClient.put(updateTicketPositionUrl, { id: ticketId, position: newPosition })
        .subscribe(
          response => console.log('Position updated successfully!'),
          error => console.error('Error updating position: ', error)
        );
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    // Si l'élément est déposé sur le deuxième tableau
    else {
      const item = event.previousContainer.data[event.previousIndex];

      // Vérifier si le productBacklogId est différent de null
      if (item.productBacklogId !== null) {
        const dialogRef = this.dialog.open(ConfirmAddUserStoryDialogueComponent, {
          width: '650px',
          height:'440px',
          data: { item: item },
        });
      } else {
        // Déplacer l'élément dans le product backlog
        const productBacklogId = this.getProductBacklogByIdFromLocalStorage();
        const updatedItem = {...item, productBacklogId: productBacklogId};
        this.assignUserStoryToProductBacklog(item.id, productBacklogId);
      }

      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      // Mettre à jour les données ou déclencher des actions en fonction du déplacement de l'élément
      console.log("Elémént déplacé: ", item);
    }
  }



  removeUserStoryFromProductBacklog(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: 'Êtes-vous sûr de vouloir supprimer cet élément ?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.histoireTicketService.removeUserStoryFromProductBacklog(id)
          .subscribe(response => {
            console.log("Ticket histoire supprimé avec succès.");
          });
      }
    });
  }

  elementCreated:boolean = false;
  @ViewChild('detailElement') detailElementRef!: ElementRef;
  @ViewChild('newElement') newElementRef!: ElementRef;
  @ViewChild('doneList') doneList!: CdkDropList;
  @ViewChild('todoList') todoList!: CdkDropList;
  @HostBinding('@fadeOut')fadeOut = false;

  basculerElement(){
    this.elementCreated = !this.elementCreated;
    if(this.elementCreated){
      this.detailElementRef.nativeElement.classList.remove('col-lg-12');
      this.detailElementRef.nativeElement.classList.add('col-lg-7');


    }else{
      this.fadeOut = true;
      this.detailElementRef.nativeElement.classList.remove('col-lg-7');
      this.detailElementRef.nativeElement.classList.add('col-lg-12');

      this.detailElementRef.nativeElement?.setAttribute('[@fadeOut]');
    }
  }


  clickCount = 0;
  move(){
    // this.onCreateNewSprint();
    this.clickCount++;
  }

  openDialog() {
    const dialogRef = this.dialog.open(AjouterTicketHistoireFormComponent, {
      width: '600px',
      height:'440px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openDialogCreateSprint() {
    const dialogRef = this.dialog.open(AjouterSprintFormComponent, {
      width: '500',
      height:'400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  getHistoireTicketsByMembreId(membreId: number): void {
    this.membreService.getHistoireTicketsByMembreId(membreId)
      .subscribe(
          histoireTicketsByMembreId => this.histoireTicketsByMembreId = histoireTicketsByMembreId.filter(ticket => ticket.productBacklogId !== this.getProductBacklogByIdFromLocalStorage())
        );
  }

  getHistoireTicketsByProductBacklogId(productBacklogId: number): void {
    this.productBacklogService.getHistoireTicketsByProductBacklogId(productBacklogId)
      .subscribe(
        histoireTicketsByProductBacklogId => this.histoireTicketsByProductBacklogId = histoireTicketsByProductBacklogId,
        );
  }

  getProjetByIdFromLocalStorage(){
    let projetCourantStr = localStorage.getItem("projetCourant");
    let projetCourantObj = JSON.parse(projetCourantStr);
    let id = projetCourantObj.id;
    console.log("id projet courant = "+id);
    return id;
  }

  getProductBacklogByIdFromLocalStorage(){
    let productBacklogCourantStr = localStorage.getItem("productBacklogCourant");
    let productBacklogCourantObj = JSON.parse(productBacklogCourantStr);
    let id = productBacklogCourantObj.id;
    console.log("id product backlog courant = "+id);
    return id;
  }

  assignUserStoryToSprint(histoireTicketId: number, sprintId: number) {
    this.histoireTicketService.assignUserStoryToSprint(histoireTicketId, sprintId)
      .subscribe(
        response => {
          console.log('Histoire ticket affecté au sprint', response);
        },
        error => console.log(error)
      );
  }

  assignUserStoryToProductBacklog(histoireTicketId: number, productBacklogId: number) {
    this.histoireTicketService.assignUserStoryToProductBacklog(histoireTicketId, productBacklogId)
      .subscribe(
        response => {
          console.log('Histoire ticket affecté au product backlog avec succès', response);
        },
        error => console.log(error)
      );
  }

  ngOnInit() {
    this.getHistoireTicketsByMembreId(1);
    this.getHistoireTicketsByProductBacklogId(this.getProductBacklogByIdFromLocalStorage());

    this.sprintService.getListSprintsByProductBacklog(this.getProductBacklogByIdFromLocalStorage()).subscribe(
      data => {
        this.sprints = data ;
      }
    );

    this.productBacklogService.getProductBacklogByIdProjet(this.getProjetByIdFromLocalStorage()).subscribe(
      data => {
        this.productBacklog = data ;
        localStorage.setItem('productBacklogCourant', JSON.stringify(this.productBacklog));
        console.log(this.productBacklog);
      }
    );
  }

  deleteUserStoryById(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogDeleteUserStoryComponent, {
      width: '250px',
      data: 'Êtes-vous sûr de vouloir supprimer cet élément ?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.histoireTicketService.deleteUserStoryById(id).subscribe(data => {
          console.log(data);
        });
      }
    });
  }

}
