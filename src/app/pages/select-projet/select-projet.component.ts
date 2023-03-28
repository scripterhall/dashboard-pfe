import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { Membre } from 'src/app/model/membre';
import { ProductBacklog } from 'src/app/model/product-backlog';
import { Projet } from 'src/app/model/projet';
import { ProductBacklogService } from 'src/app/service/product-backlog.service';
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
  valid:boolean=false;
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
  constructor(private projetService: ProjetServiceService,
              private productBacklogService:ProductBacklogService,
              private formBuilder: FormBuilder,
              private router: Router) {
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
  cocherProjet(index:number){

    this.valid = !this.valid;
    this.projets[index].checked  = !this.projets[index].checked;
  }

/*   boutton gerer de content 1  */
  gerer(index:number){
    if(confirm("Vous etes sûr de gerer le projet "+this.projets[index].nom+" !!")){
    localStorage.setItem('projetCourant', JSON.stringify(this.projets[index]));
      this.router.navigateByUrl('/dashboard')
    }


  }

  /*   annuler* ou gerer  */
onCancel() {
  this.projetForm.reset();
}

projet:Projet;

onSubmit() {
  console.log(this.projetForm.value);
  this.projetService.ajouterProjetByChef(this.projetForm.value).subscribe(
    projet => {
      this.projet = projet;
      localStorage.setItem('projet', JSON.stringify(this.projet));

      const productBacklog: ProductBacklog = new ProductBacklog();
      this.productBacklogService.createProductBacklog(productBacklog, this.projet.id).subscribe(
        data => {
          console.log('Product backlog créé avec succès:', data);
        },
        error => {
          console.error('Erreur lors de la création du product backlog:', error);
        }
      );
    },
    error => {
      console.error('Erreur lors de la création du projet:', error);
    }
  );
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
