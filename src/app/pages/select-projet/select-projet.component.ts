import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { Membre } from 'src/app/model/membre';
import { Projet } from 'src/app/model/projet';
import { ProjetServiceService } from 'src/app/service/projet-service.service';

export interface ExampleTab {
  label: string;
  content: string;
}
interface Animal {
  name: string;
  sound: string;
}


@Component({
  selector: 'app-select-projet',
  templateUrl: './select-projet.component.html',
  styleUrls: ['./select-projet.component.scss']
})


export class SelectProjetComponent implements OnInit {

  valid:boolean=true;
  /*   formulaire d'ajout de projet   */ 
  projetForm:FormGroup;

  ngOnInit(): void {
    /*   initialisation de formulaire d'ajout de projet   */ 
    this.projetForm = this.formBuilder.group({
      nom: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      cles: ['', Validators.required],
      chefProjetId:1
    });
    /*   liste des projet d'un chef de projet   */ 
    this.projetService.getListProjetChefProjet(1).subscribe(
      data => {
        this.projets = data ; 
      }
    )
   

    
  }
  
  projets:Projet[];
  asyncTabs: Observable<ExampleTab[]>;
  /* detail balise */
  panelOpenState = false;
  panelOpenState2 = false;
 /*  end */ 
  constructor(private projetService: ProjetServiceService,private formBuilder: FormBuilder) {
    this.asyncTabs = new Observable((observer: Observer<ExampleTab[]>) => {
      /*   les type des action gerer par se composant :: les sliders   */ 
      setTimeout(() => {
        observer.next([
          {label: 'Gerer', content: 'Content 1'},
          {label: 'nouveau', content: 'Content 2'},
          {label: 'Invitation', content: 'Content 3'},
        ]);
      }, 1000);
    });
  }

/*   un seul projet peut etre gerer en temps real    */ 
  cocherProjet(){
    this.valid= !this.valid;
  }

/*   boutton gerer de content 1  */ 
  gerer(){}

  /*   annuler* ou gerer  */ 
onCancel() {
  this.projetForm.reset();
}

/*   envoyer le formulaire de creation   */ 
onSubmit(){
  console.log(this.projetForm.value);
}
 

/** passer d un expansion a un autre */
step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
/** end */

  membres = new FormControl('');
  
  membreList: Membre[] = [
      new Membre(), 
      new Membre(), 
      new Membre(), 
      new Membre(), 
      new Membre(), 
      new Membre(), 
  ];

  /** liste des membre cocher pour les invité */
  cochedMembre:Membre[]=[];

  animalControl = new FormControl<Animal | null>(null, Validators.required);
  selectFormControl = new FormControl('', Validators.required);
  animals: Animal[] = [
    {name: 'Dog', sound: 'Woof!'},
    {name: 'Cat', sound: 'Meow!'},
    {name: 'Cow', sound: 'Moo!'},
    {name: 'Fox', sound: 'Wa-pa-pa-pa-pa-pa-pow!'},
  ];
}
