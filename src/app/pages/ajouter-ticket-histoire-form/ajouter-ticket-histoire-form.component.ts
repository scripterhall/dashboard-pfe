import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { HistoireTicketService } from 'src/app/service/histoire-ticket.service';
import {FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

@Component({
  selector: 'app-ajouter-ticket-histoire-form',
  templateUrl: './ajouter-ticket-histoire-form.component.html',
  styleUrls: ['./ajouter-ticket-histoire-form.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {showError: true},
    },
  ]
})
export class AjouterTicketHistoireFormComponent {

  efforts: number[]=this.histoireTicketService.efforts;
  priorities: string[]=this.histoireTicketService.priorities;

  constructor(private fb: FormBuilder, private histoireTicketService:HistoireTicketService,
    public dialogRef: MatDialogRef<AjouterTicketHistoireFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave() {
    const formData = this.form.value;
    formData.membreId=1;
    this.histoireTicketService.addTicket(formData).subscribe(
      response => {
        console.log('Ticket histoire ajouté avec succès.');
        console.log(formData);
console.log('id histoire ticket = '+formData.id)
        this.dialogRef.close(response);
      },
      error => {
        console.error("Erreur d'enregistrement du ticket histoire ! : ", error);
      }
    );
  }

  form: FormGroup;
  ngOnInit(): void {
    this.form = this.fb.group({
      titre: ['', Validators.required],
      description: [''],
      effort: ['', Validators.required],
      priorite: ['', Validators.required],
      membreId:1
    });
  }


}

