import { Component } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { HistoireTicketService } from 'src/app/service/histoire-ticket.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ajouter-ticket-histoire-form',
  templateUrl: './ajouter-ticket-histoire-form.component.html',
  styleUrls: ['./ajouter-ticket-histoire-form.component.scss']
})
export class AjouterTicketHistoireFormComponent {
  constructor(private fb: FormBuilder, private histoireTicketService:HistoireTicketService,
    public dialogRef: MatDialogRef<AjouterTicketHistoireFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  form: FormGroup;

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave() {
    const formData = this.form.value;
    this.histoireTicketService.addTicket(formData).subscribe(
      response => {
        console.log('Ticket histoire ajouté avec succès.');
        console.log(formData);
        this.dialogRef.close();
      },
      error => {
        console.error("Erreur d'enregistrement du ticket histoire ! : ", error);
      }
    );
  }

  validateDateFin(control: AbstractControl): {[key: string]: any} | null {
    const dateDeb = new Date(control.parent?.get('dateDeb').value);
    const dateFin = new Date(control.value);
    if (dateDeb && dateFin && dateDeb >= dateFin) {
      return { 'dateFinInvalide': true };
    }
    return null;
  }


  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: [''],
      effort: ['', [Validators.required, Validators.min(1), Validators.max(13)]],
      priorite: [''],
      dateDeb: [],
      dateFin: ['', this.validateDateFin.bind(this)]
    });
  }

}

