import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SprintService } from 'src/app/service/sprint.service';
import { Inject } from '@angular/core';
import { Sprint } from 'src/app/model/sprint';

@Component({
  selector: 'app-ajouter-sprint-form',
  templateUrl: './ajouter-sprint-form.component.html',
  styleUrls: ['./ajouter-sprint-form.component.scss']
})
export class AjouterSprintFormComponent {
  constructor(private fb: FormBuilder, private sprintService:SprintService,
    public dialogRef: MatDialogRef<AjouterSprintFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  form: FormGroup;

  onNoClick(): void {
    this.dialogRef.close();
  }

  // onSave() {
  //   const formData = this.form.value;
  //   this.sprintService.createSprint(formData).subscribe(
  //     response => {
  //       console.log('Sprint ajouté avec succès.');
  //       console.log(formData);
  //       this.move();
  //       location.reload();
  //       this.dialogRef.close();
  //     },
  //     error => {
  //       console.error("Erreur d'enregistrement du sprint ! : ", error);
  //     }
  //   );
  // }

  onSave(): void {
    const productBacklogId = 1;
    const sprint = new Sprint();

    sprint.objectif = this.form.get('objectif').value;
    sprint.dateLancement = new Date(this.form.get('dateLancement').value);
    sprint.dateFin = new Date(this.form.get('dateFin').value);

    this.sprintService.createSprint(sprint, productBacklogId).subscribe(
      createdSprint => {
      console.log(sprint);
        console.log('Sprint créé avec succès :', createdSprint);
        this.move();
        // location.reload();
        this.dialogRef.close();
      },
      error => {
        console.error('Erreur lors de la création du sprint :', error);
      }
    );
  }



  clickCount = 0;
  move(){
    this.clickCount++;
  }

  validateDateFin(control: AbstractControl): {[key: string]: any} | null {
    const dateLancement = new Date(control.parent?.get('dateLancement').value);
    const dateFin = new Date(control.value);
    if (dateLancement && dateFin && dateLancement >= dateFin) {
      return { 'dateFinInvalide': true };
    }
    return null;
  }

  dateSystemValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      const dateInput = new Date(control.value);
      const dateSystem = new Date(Date.now());
      if (dateInput.getTime() >= dateSystem.getTime()) {
        return null;
      } else {
        return { dateInvalid: true };
      }
    };
  }
  
  ngOnInit(): void {
    this.form = this.fb.group({
      objectif: ['', Validators.required],
      dateLancement: [new Date(),this.dateSystemValidator()],
      dateFin: ['', this.validateDateFin.bind(this)]
    });
  }


}
