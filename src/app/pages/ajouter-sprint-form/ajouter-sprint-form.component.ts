import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SprintService } from 'src/app/service/sprint.service';
import { Inject } from '@angular/core';
import { Sprint } from 'src/app/model/sprint';
import { Projet } from 'src/app/model/projet';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ajouter-sprint-form',
  templateUrl: './ajouter-sprint-form.component.html',
  styleUrls: ['./ajouter-sprint-form.component.scss']
})
export class AjouterSprintFormComponent {
  constructor(private fb: FormBuilder, private sprintService:SprintService,
    public dialogRef: MatDialogRef<AjouterSprintFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private toastr: ToastrService
  ) { }

  form: FormGroup;
  sprints:Sprint[];

  onNoClick(): void {
    this.dialogRef.close();
  }

  getProductBacklogByIdFromLocalStorage(){
    let productBacklogCourantStr = localStorage.getItem("productBacklogCourant");
    let productBacklogCourantObj = JSON.parse(productBacklogCourantStr);
    let id = productBacklogCourantObj.id;
    console.log("id product backlog courant = "+id);
    return id;
  }

  getListSprintsByProductBacklog(){
      this.sprintService.getListSprintsByProductBacklog(this.getProductBacklogByIdFromLocalStorage()).subscribe(
        data => {
          this.sprints = data ;
        }
      );
    }

  // onSave(): void {
  //   const productBacklogId = this.getProductBacklogByIdFromLocalStorage();
  //   const sprint = new Sprint();

  //   sprint.objectif = this.form.get('objectif').value;
  //   sprint.dateLancement = new Date(this.form.get('dateLancement').value);
  //   sprint.dateFin = new Date(this.form.get('dateFin').value);

  //   const dateDebProjet = new Date(this.getProjetByIdFromLocalStorage().dateDebut);
  //   const dateFinProjet = new Date(this.getProjetByIdFromLocalStorage().dateFin);

  //   const conflit = this.sprints.some(existingSprint => {
  //     const existingSprintDebut = new Date(existingSprint.dateLancement);
  //     const existingSprintFin = new Date(existingSprint.dateFin);
  //     return (sprint.dateLancement >= existingSprintDebut && sprint.dateLancement <= existingSprintFin) ||
  //       (sprint.dateFin >= existingSprintDebut && sprint.dateFin <= existingSprintFin) ||
  //       (existingSprintDebut >= sprint.dateLancement && existingSprintDebut <= sprint.dateFin) ||
  //       (existingSprintFin >= sprint.dateLancement && existingSprintFin <= sprint.dateFin);
  //   });

  //   if (conflit) {
  //     this.toastr.error('La période du sprint se chevauche avec un sprint existant.');
  //     return;
  //   }

  //   if (sprint.dateLancement < dateDebProjet || sprint.dateFin > dateFinProjet) {
  //     this.toastr.error('Le sprint ne se trouve pas dans la période du projet');
  //     return;
  //   }

  //   if (this.sprints.length === 0) {
  //     const diffTime = Math.abs(sprint.dateFin.getTime() - sprint.dateLancement.getTime());
  //     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //     localStorage.setItem('firstSprintDuration', diffDays.toString());
  //   }

  //   this.sprintService.createSprint(sprint, productBacklogId).subscribe(
  //     createdSprint => {
  //       console.log(sprint);
  //       console.log('Sprint créé avec succès :', createdSprint);
  //       this.dialogRef.close(createdSprint);
  //     },
  //     error => {
  //       console.error('Erreur lors de la création du sprint :', error);
  //       this.toastr.error('Erreur lors de la création du sprint.');
  //     }
  //   );
  // }

  onSave(): void {
    const productBacklogId = this.getProductBacklogByIdFromLocalStorage();
    const sprint = new Sprint();

    sprint.objectif = this.form.get('objectif').value;
    sprint.dateLancement = new Date(this.form.get('dateLancement').value);
    sprint.dateFin = new Date(this.form.get('dateFin').value);

    const dateDebProjet = new Date(this.getProjetByIdFromLocalStorage().dateDebut);
    const dateFinProjet = new Date(this.getProjetByIdFromLocalStorage().dateFin);

    const conflit = this.sprints.some(existingSprint => {
      const existingSprintDebut = new Date(existingSprint.dateLancement);
      const existingSprintFin = new Date(existingSprint.dateFin);
      return (sprint.dateLancement >= existingSprintDebut && sprint.dateLancement <= existingSprintFin) ||
        (sprint.dateFin >= existingSprintDebut && sprint.dateFin <= existingSprintFin) ||
        (existingSprintDebut >= sprint.dateLancement && existingSprintDebut <= sprint.dateFin) ||
        (existingSprintFin >= sprint.dateLancement && existingSprintFin <= sprint.dateFin);
    });

    if (conflit) {
      this.toastr.error('La période du sprint se chevauche avec un sprint existant.');
      return;
    }

    if (sprint.dateLancement < dateDebProjet || sprint.dateFin > dateFinProjet) {
      this.toastr.error('Le sprint ne se trouve pas dans la période du projet');
      return;
    }

    if (this.sprints.length === 0) {
      const diffTime = Math.abs(sprint.dateFin.getTime() - sprint.dateLancement.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      localStorage.setItem('sprintDuration', diffDays.toString());
    } else {
      const storedDuration = localStorage.getItem('sprintDuration');
      const diffTime = Math.abs(sprint.dateFin.getTime() - sprint.dateLancement.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays !== parseInt(storedDuration)) {
        this.toastr.error('La durée du sprint est différente de la durée enregistrée dans le localStorage.');
        return;
      }
    }

    sprint.productBacklogId = productBacklogId;
    this.sprintService.createSprint(sprint, productBacklogId).subscribe(
      (response) => {
        this.toastr.success('Le sprint a été créé avec succès');
        this.dialogRef.close(response);
      },
      (error) => {
        this.toastr.error('Erreur lors de la création du sprint.');
        console.error(error);
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

  getProjetByIdFromLocalStorage(){
    let projetCourantStr = localStorage.getItem("projet");
    let projetCourantObj:Projet= JSON.parse(projetCourantStr);
    console.log(projetCourantObj);
    return projetCourantObj;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      objectif: ['', Validators.required],
      dateLancement: [new Date(),this.dateSystemValidator()],
      dateFin: ['', this.validateDateFin.bind(this)]
    });
    this.getListSprintsByProductBacklog();
  }


}
