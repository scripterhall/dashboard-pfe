import { animate, state, style, transition, trigger } from "@angular/animations";
import { CdkDragDrop, CdkDragEnd, CdkDragExit, CdkDragStart, CdkDropList, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, HostBinding, OnInit, ViewChild } from "@angular/core";
import { Sprint } from "src/app/model/sprint";
import { TicketHistoire } from "src/app/model/ticket-histoire";
import { SprintDialogPanelComponent } from "../dialogs/sprint-dialog-panel/sprint-dialog-panel.component";
import { MatSnackBar } from '@angular/material/snack-bar';



export interface DialogData {
  sprint: Sprint;
  TicketHistoires:TicketHistoire[]
  canStart:boolean
}
import { HistoireTicketService } from "src/app/service/histoire-ticket.service";
import { SprintService } from "src/app/service/sprint.service";
import { MembreService } from "src/app/service/membre.service";
import { ProductBacklog } from "src/app/model/product-backlog";
import { ConfirmDialogComponent } from "../confirm-dialog/confirm-dialog.component";
import { ConfirmDialogDeleteUserStoryComponent } from "../confirm-dialog-delete-user-story/confirm-dialog-delete-user-story.component";
import { ConfirmAddUserStoryDialogueComponent } from "../confirm-add-user-story-dialogue/confirm-add-user-story-dialogue.component";
import { ToastrService } from "ngx-toastr";
import { UpdateUserStoryDialogComponent } from "../update-user-story-dialog/update-user-story-dialog.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AjouterTicketHistoireFormComponent } from "../ajouter-ticket-histoire-form/ajouter-ticket-histoire-form.component";
import { AjouterSprintFormComponent } from "../ajouter-sprint-form/ajouter-sprint-form.component";
import { ProductBacklogService } from "src/app/service/product-backlog.service";
import { Ticket } from "src/app/model/ticket";
import Swal from "sweetalert2";

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
  histoireTicketsSprint: TicketHistoire[];
  constructor(private histoireTicketService:HistoireTicketService,
    private productBacklogService:ProductBacklogService,
    private sprintService:SprintService, private dialog: MatDialog,
    public dialogDetailSprint: MatDialog, private membreService:MembreService,
    private toastr: ToastrService, private snackBar: MatSnackBar) {}

  sprints:Sprint[];
  histoireTicketsByMembreId:TicketHistoire[];
  productBacklog: ProductBacklog;
  histoireTicketsByProductBacklogId:TicketHistoire[];
  ticket:TicketHistoire;
  histoireTicket: TicketHistoire;
  newProductBacklogId: number;
  selectedSprint: number;
  sprintsVelocitySum: number = 0;


  drop(event: CdkDragDrop<TicketHistoire[]>) {
    if (event.previousContainer === event.container) {

      console.log('dropped', event);

      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);

      event.container.data.forEach((element, index) => {
        element.position = index + 1;
        this.histoireTicketService.updateUserStory(element.id, element).subscribe(
          res => {
            console.log('element : '+element.id+', nouvelle position = '+element.position)
          },
          err => {
            console.log('Erreur lors de la mise à jour de l\'élément : '+element.id);
          }
        );
      });
    }
    else {
      const item = event.previousContainer.data[event.previousIndex];
      if (item.productBacklogId !== null) {
        const dialogRef = this.dialog.open(ConfirmAddUserStoryDialogueComponent, {
          width: '650px',
          height:'440px',
          data: { item: item },
        });
      }else{
        const productBacklogId = this.getProductBacklogByIdFromLocalStorage();
        this.assignUserStoryToProductBacklog(item.id, productBacklogId);

        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
      }}}

  deleteUserStoryById(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogDeleteUserStoryComponent, {
      width: '250px',
      data: 'Êtes-vous sûr de vouloir supprimer cet élément ?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.histoireTicketService.deleteUserStoryById(id).subscribe(data => {
          console.log(data);
          const index = this.histoireTicketsByMembreId.findIndex(item => item.id === id);
          if (index !== -1) {
            this.histoireTicketsByMembreId.splice(index, 1);
            this.snackBar.open('Le ticket histoire a été supprimé.', 'Fermer', {
              duration: 3000,
            });
          }
        });
      }
    });
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

removeUserStoryFromProductBacklog(id: number) {
  event.stopPropagation();
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
      this.productBacklogService.decreaseProductBacklogVelocity(this.productBacklogService.getProductBacklogByIdFromLocalStorage(), id)
        .subscribe(response => {
          console.log("Effort retiré avec succès du backlog produit.");
        },
        error => {
          console.error('Une erreur est survenue :', error);
        });
      const index = this.histoireTicketsByProductBacklogId.findIndex(item => item.id === id);
      if (index !== -1) {
        this.histoireTicketsByProductBacklogId.splice(index, 1);
      }
    }
  });
}


  //sprint details
  openDialogDetailsSprint(i:number,sp:Sprint) {
    console.log(sp);
    this.histoireTicketService.getHistoireTicketBySprintId(sp.id).subscribe(
      data =>{
        this.histoireTicketsSprint = data
        const dialogRef = this.dialog.open(SprintDialogPanelComponent,{
          width: '600px',
          height:'690px',
          data: {sprint:this.sprints[i],
                TicketHistoires:this.histoireTicketsSprint,
                canStart :this.checkStartOneSprint()
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          this.ngOnInit()
        });
      }
    )
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
          const sprintIndex = this.sprints.findIndex(sprint => sprint.id == sprintId);
          const selectedSprintValue = `Sprint ${sprintIndex + 1}`;
          this.toastr.success(`Histoire ticket affecté au ${selectedSprintValue}`);
        },
        error => console.log(error)
      );
    console.log('id sprint :'+sprintId);
    const sprint = this.sprints.find(sprint => sprint.id == sprintId);
    const ticketHistoire = this.histoireTicketsByProductBacklogId.find(histoire => histoire.id == histoireTicketId)
    console.log(ticketHistoire);
    console.log(sprint);
    if(sprint.etat == "en attente")
      this.addUserStoryToSprint(histoireTicketId,sprintId)
      else{
        if(((this.sprints.indexOf(sprint)+1) - this.sprints.length) == 0){
          Swal.fire(
            'insertion impossible ⛔',
            'ce sprint est lancé si possible \n creer un autre sprint pour les affecter \n d\'autres ticket histoire',
            'error',
          )
        }else{
          const nextSprint = this.sprints[this.sprints.indexOf(sprint)+1]
          Swal.fire({
            title: "voullez vous inserer cette ticket histoire dans le sprint suivant : ",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Inserer',
            cancelButtonText: 'Annuler',
            background:'rgba(0,0,0,0.9)',
            backdrop: 'rgba(0,0,0,0.4)',
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            focusConfirm: false
          }).then((result) => {
            if (result.isConfirmed) {
              // Le code à exécuter si l'utilisateur a cliqué sur "Oui, supprimer!"
              this.addUserStoryToSprint(histoireTicketId,nextSprint.id)
              console.log(nextSprint);
              Swal.fire(
                'insertion effectué',
                'consulter le sprint pour voire le details',
                'success',
              )

            }
          });
        }
      }
  }

  assignUserStoryToProductBacklog(histoireTicketId: number, productBacklogId: number) {
    this.histoireTicketService.getUserStoryById(histoireTicketId).subscribe(
      histoireTicket => {
        console.log(`L'ID de l'histoire ticket est : ${histoireTicket.id}`);
        this.histoireTicketService.assignUserStoryToProductBacklog(histoireTicketId, productBacklogId).subscribe(
          response => {
            console.log('Histoire ticket affecté au product backlog avec succès', response);
            this.elevateProductBacklogVelocity(productBacklogId, histoireTicket.effort);
          },
          error => console.log(error)
        );
      },
      error => console.log(error)
    );
  }


  elevateProductBacklogVelocity(productBacklogId: number, effort: number) {
    this.productBacklogService.elevateProductBacklogVelocity(productBacklogId, effort)
      .subscribe(
        response => {
          console.log('Response:', response);
        },
        error => {
          console.error('Error:', error);
        }
      );
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

  addUserStoryToSprint(histoireTicketId: number, sprintId: number){
    const sprint = this.sprints.find(sprint => sprint.id == sprintId);
    console.log(sprint);

    const ticketHistoire = this.histoireTicketsByProductBacklogId.find(histoire => histoire.id == histoireTicketId)
    this.histoireTicketService.assignUserStoryToSprint(histoireTicketId, sprintId)
        .subscribe(
          response => {
            console.log('Histoire ticket affecté au sprint', response);
            const indexSprint = this.sprints.indexOf(this.sprints.find(sprint => sprint.id == sprintId))+ 1
            const selectedSprintValue = `Sprint ${indexSprint}`;
            /** block add  velocity to sprint */
            sprint.velocite += ticketHistoire.effort
            sprint.productBacklogId = JSON.parse(localStorage.getItem('productBacklogCourant')).id
            this.sprintService.modifierSprint(sprint).subscribe(
              sprintNewData =>{
                sprint.velocite = sprintNewData.velocite
                console.log(sprintNewData);
              }
            )
            /** end block  */
            this.toastr.success(`Histoire ticket affecté au ${selectedSprintValue}`);
          },
          error => console.log(error)
        );
  }

  clickCount = 0;
  move(){
    this.clickCount++;
  }

  openDialog() {
    const dialogRef = this.dialog.open(AjouterTicketHistoireFormComponent, {
      width: '600px',
      height:'440px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.histoireTicketsByMembreId.push(result)
      console.log('The dialog was closed');

    });
  }

  openDialogCreateSprint() {
    const dialogRef = this.dialog.open(AjouterSprintFormComponent, {
      width: '500',
      height:'400px',
      data: {

      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.sprints.push(result)
    });
  }

  getHistoireTicketsByMembreId(membreId: number): void {
    this.membreService.getHistoireTicketsByMembreId(membreId)
      .subscribe(
          histoireTicketsByMembreId => this.histoireTicketsByMembreId = histoireTicketsByMembreId.filter(ticket => ticket.productBacklogId !== this.getProductBacklogByIdFromLocalStorage())
        );
  }

    ngOnInit(){
      this.productBacklogService.getProductBacklogByIdProjet(this.getProjetByIdFromLocalStorage()).subscribe(
        data => {
          const productBacklog = data;
          console.log(productBacklog);
          localStorage.setItem('productBacklogCourant', JSON.stringify(productBacklog));
          console.log(this.productBacklog);
        },
        error => {
          console.log('Une erreur s\'est produite lors de la récupération du product backlog : ', error);
        }
      );

      this.getHistoireTicketsByMembreId(1);
      this.getHistoireTicketsByProductBacklogId(this.getProductBacklogByIdFromLocalStorage());
      this.sprintService.getListSprintsByProductBacklog(this.getProductBacklogByIdFromLocalStorage()).subscribe(
        data => {
          this.sprints = data ;
          this.sprints.forEach(sprint => {
            this.sprintsVelocitySum += sprint.velocite;
          });
          console.log("Somme de vélocité des sprints: " + this.sprintsVelocitySum);
        }
      );

    }

    openDialogUpdateUserStory(id: number) {
      const dialogRef = this.dialog.open(UpdateUserStoryDialogComponent, {
        width: '500px',
        data: { id: id }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }


    checkStartOneSprint():Boolean{
      for(let sprint of this.sprints){
        if (sprint.etat == "en cours")
          return true;
      }

    }
}
