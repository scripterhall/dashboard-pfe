import { Component,Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TicketTacheService } from 'src/app/service/ticket-tache.service';
import { DialogDataTicketTache } from '../../map/map.component';

@Component({
  selector: 'app-ajout-tache-spb',
  templateUrl: './ajout-tache-spb.component.html',
  styleUrls: ['./ajout-tache-spb.component.scss']
})
export class AjoutTacheSpbComponent implements OnInit {

  constructor(
    private ticketTacheService: TicketTacheService,
    public dialogRef: MatDialogRef<AjoutTacheSpbComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataTicketTache,
    private fb:FormBuilder
  ){}

  ticketTacheForm: FormGroup;

  ngOnInit(): void {
    this.ticketTacheForm = this.fb.group({
      nbHeurs: [null,Validators.required],
      titre: ['',Validators.required],
      sprintBacklogId:this.data.sprintBacklog.id,
      ticketHistoireId:this.data.ticketHistoire.id,
      etat:"à faire",
      description: [null, Validators.required],
    });
  }


  ajouterTicketTacheAuSpb(){

    this.ticketTacheService.ajouterTicketTache(this.ticketTacheForm.value).subscribe(
      data => {
        this.dialogRef.close(data);
      }
    )

  }

}
