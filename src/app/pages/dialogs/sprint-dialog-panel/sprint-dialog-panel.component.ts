import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TacheTicket } from 'src/app/model/tache-ticket';
import { TicketTacheService } from 'src/app/service/ticket-tache.service';
import { DialogData } from '../../icons/icons.component';

@Component({
  selector: 'app-sprint-dialog-panel',
  templateUrl: './sprint-dialog-panel.component.html',
  styleUrls: ['./sprint-dialog-panel.component.scss']
})
export class SprintDialogPanelComponent implements OnInit{


  ticketTacheList:TacheTicket[]

  constructor( public dialogRef: MatDialogRef<SprintDialogPanelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb:FormBuilder,
    private ticketTacheService:TicketTacheService
    ){}

    TicketTacheModif:FormGroup;

  ngOnInit(): void {

    this.TicketTacheModif = this.fb.group({
      id: [, Validators.required],
      nbrHeurs: [, Validators.required],
      membreId:[],
      SprintBacklogId: [],
      etat:[]
    })
    this.ticketTacheService.getListTicketTacheParHt(1).subscribe(
      data=>{
        console.log(data);
        this.ticketTacheList = data ; 
      }
    )


  }
}
