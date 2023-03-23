import { HttpClient } from '@angular/common/http';
import { Component, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TicketHistoire } from 'src/app/model/ticket-histoire';
import { HistoireTicketService } from 'src/app/service/histoire-ticket.service';

@Component({
  selector: 'app-confirm-add-user-story-dialogue',
  templateUrl: './confirm-add-user-story-dialogue.component.html',
  styleUrls: ['./confirm-add-user-story-dialogue.component.scss']
})
export class ConfirmAddUserStoryDialogueComponent {

  isFormDisabled = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private http: HttpClient, private histoireTicketService:HistoireTicketService) { }

  toggleForm() {
    this.isFormDisabled = !this.isFormDisabled;
    if (!this.isFormDisabled) {
      // si le formulaire est activé, on copie les valeurs du ticket sélectionné
      this.data.item.productBacklogId = this.getProductBacklogByIdFromLocalStorage;
      this.data.item = {...this.data.item};
    }
  }

  addNewUserStory() {
    const newItem = {...this.data.item};
    newItem.id = null;
    newItem.productBacklogId=this.getProductBacklogByIdFromLocalStorage();
    this.histoireTicketService.addNewUserStory(newItem).subscribe(
      response => {
        console.log('élément ajouté avec succès');
      },
      error => {
        console.error('erreur lors de l\'ajout de l\'élément : ', error);
      }
    );
  }


  getProductBacklogByIdFromLocalStorage(){
    let productBacklogCourantStr = localStorage.getItem("productBacklogCourant");
    let productBacklogCourantObj = JSON.parse(productBacklogCourantStr);
    let id = productBacklogCourantObj.id;
    console.log("id product backlog courant = "+id);
    return id;
  }

}

