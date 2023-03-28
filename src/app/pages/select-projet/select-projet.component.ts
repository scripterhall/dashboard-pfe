import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { ProductBacklog } from 'src/app/model/product-backlog';
import { ProductBacklogService } from 'src/app/service/product-backlog.service';
import { Invitation } from 'src/app/model/invitation';
import { Membre } from 'src/app/model/membre';
import { Projet } from 'src/app/model/projet';
import { Role } from 'src/app/model/role';
import { InvitationService } from 'src/app/service/invitation.service';
import { MembreService } from 'src/app/service/membre.service';
import { ProjetServiceService } from 'src/app/service/projet-service.service';
import { RoleService } from 'src/app/service/role.service';
import Swal from 'sweetalert2';

export interface ExampleTab {
  label: string;
  content: string;
}

interface Request {
  invitation: Invitation;
  projet: Projet;
}

@Component({
  selector: 'app-select-projet',
  templateUrl: './select-projet.component.html',
  styleUrls: ['./select-projet.component.scss']
})


export class SelectProjetComponent implements OnInit {

  permissionMap=new Map<string,string>([
    ["dev team","droit de lecture et ecriture sur le sprint ansi que sprintBacklog et les ticket tâche "],
    ["po","droit d'ecriture et lecture sur le product backlog et les ticket histoire"],
    ["scrum master","droit de lecture sur les backlogs la possibiliter de lancer des meeting "]
  ]);
  descriptionMap=new Map<string,string>([
    ["dev team","vous êtes un des membre chargé\n de realiser des increment potentiellement livrable chaque\nsprint"],
    ["po","vous êtes le professionnel responsable\nde maximiser la valeur du produit\nrésultant du travail de l'équipe \nde développement ou, en d'autres\n termes, de maximiser la valeur\n pour le projet"],
    ["scrum master","vous êtes chargé d'assurer que\nScrum est compris et mis en œuvre. "]
  ]);


  emailLocal:string
  valid:boolean=false;
  /*   formulaire d'ajout de projet   */
  projetForm:FormGroup;

  /** les formulaire d'invi et de creation de role */
  invitationForm:FormGroup;
  roleForm:FormGroup;
  invitationPkForm:FormGroup;
  rolePkForm:FormGroup ;
  combinedForm:FormGroup;
  ngOnInit(): void {

    this.invitationPkForm = this.formBuilder2.group({

      id:null
    })

    this.rolePkForm = this.formBuilder2.group({
      membreId:null,
      projetId:[null,Validators.required]
    })

    this.invitationForm = this.formBuilder2.group({
      chefProjetId:1,
      emailInvitee:["",Validators.required],
      membreId:null
    })

    this.roleForm = this.formBuilder2.group({
      pk:this.rolePkForm,
      type :["",Validators.required],
      permission :[""],
      description:[""]
    })


    this.combinedForm = this.formBuilder2.group({
      invitation:this.invitationForm,
      role:this.roleForm
    })
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

    this.membreService.afficherTousMembres().subscribe(
      data=>{
        this.membreList = data
      }
    )

    /**les eccouteurs de champ */

    this.rolePkForm.get('membreId').valueChanges.subscribe(
      membreId=>{

        const membre = this.membreList.find(membre => membre.id == membreId)
        this.invitationForm.patchValue({ emailInvitee: membre.email || null });
        this.invitationForm.patchValue({membreId:membreId || null})
      }
    )

    this.roleForm.get('type').valueChanges.subscribe(
      typeNumber=>{

        this.roleForm.patchValue({ permission: this.permissionMap.get(typeNumber) || null });
      }
    )

    this.roleForm.get('type').valueChanges.subscribe(
      typeNumber=>{

        this.roleForm.patchValue({ description: this.descriptionMap.get(typeNumber) || null });
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
              private formBuilder: FormBuilder,
              private formBuilder2: FormBuilder,
              private roleService: RoleService,
              private invitationService: InvitationService,
              private membreService: MembreService,
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
    localStorage.setItem('projets', JSON.stringify(this.projets[index]));
      this.router.navigateByUrl('/dashboard')
    }


  }

  /*   annuler* ou gerer  */
onCancel() {
  this.projetForm.reset();
}

/*   envoyer le formulaire de creation   */
projet:Projet;
onSubmit(){
  console.log(this.projetForm.value);
  this.projetService.ajouterProjetByChef(this.projetForm.value).subscribe(
    data=>{
      this.projet = data;
      localStorage.setItem('projet',JSON.stringify(this.projet));
    }
  )
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

  membreList: Membre[]

  /** liste des membre cocher pour les invité */
  cochedMembre:Membre[]=[];

  allValid(){
    return this.roleForm.valid
    && this.rolePkForm.valid
    && this.invitationForm.valid
    && this.invitationPkForm.valid
  }



  inviter(){
    console.log(this.invitationForm.value);
    console.log(this.combinedForm.get('invitation').value);
    const projetChoisis = this.projets.find(projet => projet.id == this.rolePkForm.get('projetId').value)
    let request:Request = {
      invitation:this.invitationForm.value,
      projet:projetChoisis
    }
    this.invitationService.envoyerInvitation(request).subscribe(
      data => {
        console.log(data);
        let role:Role = this.roleForm.value
        role.pk.membreId = data.membreId
        console.log(role);

        this.roleService.ajouterRole(role).subscribe(
          data => {
            console.log("role : "+data);

          }
        )
      }
    )
    Swal.fire(
      'Félicitation',
      'Invitation Envoiyée',
      'success',
    )

  }
}
