import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Projet } from 'src/app/model/projet';
import { SprintBacklog } from 'src/app/model/sprint-backlog';
import { TacheTicket } from 'src/app/model/tache-ticket';
import { TicketHistoire } from 'src/app/model/ticket-histoire';
import { HistoireTicketService } from 'src/app/service/histoire-ticket.service';
import { SprintBacklogService } from 'src/app/service/sprint-backlog.service';
import { SprintService } from 'src/app/service/sprint.service';
import { TicketTacheService } from 'src/app/service/ticket-tache.service';
import { DialogData } from '../../icons/icons.component';



@Component({
  selector: 'app-sprint-dialog-panel',
  templateUrl: './sprint-dialog-panel.component.html',
  styleUrls: ['./sprint-dialog-panel.component.scss']
})
export class SprintDialogPanelComponent implements OnInit{

  @ViewChild('tacheDetails') myDetails: ElementRef;
  @ViewChild('calendar') calendarLancement: ElementRef;
  @ViewChild('calendarFin') calendarFin: ElementRef;

  ticketTacheList:TacheTicket[]
  projet:Projet;
  public ticketTacheForm: FormGroup;
  constructor( public dialogRef: MatDialogRef<SprintDialogPanelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb:FormBuilder,
    private sprintService:SprintService,
    private ticketTacheService:TicketTacheService,
    private histoireTicketService:HistoireTicketService,
    private sprintBacklogService:SprintBacklogService
    ){
      
    }

    TicketTacheModif:FormGroup;

  ngOnInit(): void {
    console.log(this.data.TicketHistoires);
    
    this.projet = JSON.parse(localStorage.getItem("projet"))
    this.TicketTacheModif = this.fb.group({
      id: ['', Validators.required],
      nbrHeurs: ['', Validators.required],
      membreId:[],
      SprintBacklogId: [],
      etat:[]
    })

    this.ticketTacheForm = this.fb.group({
      nbHeurs: [null,Validators.required],
      titre: ['',Validators.required],

      description: [null, Validators.required],
    });
    const conv_data = new Date(this.data.sprint.dateLancement);
    
    if(conv_data.getDay() == new Date().getDay()
      && this.data.sprint.etat != "en cours"
      && !this.data.canStart
      && confirm("Aujourd'hui c'est la date de Lancement de ce sprint voulez vous accepter !!")){
      this.lancerSprint()
    }
    
  }
  ajouterTick = false;

  //afficher tous les ticket tâche d'un ticket histoire
  afficherTicketTache(ht:TicketHistoire){
    
    this.ticketTacheService.getListTicketTacheParHt(ht.id).subscribe(
      data=>{
        console.log(data);
        this.ticketTacheList = data ; 
      }
    )
  }

  isOpen = false;
  showDetailSprint(){
    this.isOpen = !this.isOpen
  }

  modifActif=false;

  //detacher ticket histoire de sprint
  detacherHt(ht:TicketHistoire,i:number){
    console.log(ht.sprint);
    
    if(confirm('vous êtes sur de detacher cette ticket histoire de sprint')){
      ht.sprintId = null
      this.histoireTicketService.DetacherHtSprint(ht).subscribe(
        dataHt =>{
            this.data.TicketHistoires.splice(i,1)
        }
      )
    }
    
  }

  changeDates:FormGroup;
  showModif(){
    // console.log(this.data.sprint.productBacklogId)
    this.changeDates = this.fb.group({
      dateLancement: [this.data.sprint.dateLancement,Validators.required],
      dateFin: [this.data.sprint.dateFin,[this.validateDateFin.bind(this),Validators.required]]
    })
    this.modifActif = !this.modifActif
  }

  //valider date fin
  validateDateFin(control: AbstractControl): {[key: string]: any} | null {
    const dateLancement = new Date(control.parent?.get('dateLancement').value);
    const dateFin = new Date(control.value);
    if (dateLancement && dateFin && dateLancement >= dateFin) {
      return { 'dateFinInvalide': true };
    }
    return null;
  }

  listEtat = [
    "terminer",
    "a faire",
    "a verifier",
    "en cours"
  ]

  //modifier sprint detail
  terminerChangement(){
    console.log(this.data.sprint.productBacklogId)
      this.data.sprint.productBacklogId = this.data.sprint.productBacklog.id
      this.data.sprint.etat = 'a faire'
      this.data.sprint.dateLancement = this.changeDates.get('dateLancement').value
      this.data.sprint.dateFin = this.changeDates.get('dateFin').value
      this.sprintService.modifierSprint(this.data.sprint).subscribe(
        data =>{
          console.log(data);
          this.data.sprint = data;
          this.modifActif = false;
        }
      )
  }

  //afficher le formualire d'ajout
  showFormAjout(){
    this.ajouterTick = !this.ajouterTick
  }

  //ajouter une ticket tache dans le panel de detail sprint
  ajouterTicketTache(ht:TicketHistoire){

    console.log(this.ticketTacheForm.value)
    let ticketTache:TacheTicket = this.ticketTacheForm.value 
    ticketTache.ht = ht
    ticketTache.sprintBacklogId = null
    ticketTache.ticketHistoireId = ht.id;
    console.log(ticketTache);
    this.ticketTacheService.ajouterTicketTache(ticketTache).subscribe(
      data =>{
        console.log(data);
        this.ticketTacheList.push(data);
        this.ajouterTick = false;
      }
    ) 
  }

  //supprimer une ticket tache dans le panel de details sprint
  supprimerTicketTache(i:number){
    if(confirm('vous êtes sur de supprimer cette tâche !'))
      this.ticketTacheService.supprimerTicketTache(this.ticketTacheList[i].id).subscribe(
        data =>{
          this.ticketTacheList.splice(i,1)
        }
      )
  }

   

  //lancer le sprint et generer un sprintBacklog avec force
  lancerSprintForcer(){
    this.data.sprint.dateLancement = new Date(Date.now());
    if(confirm("en appuyant sur le boutton <ok> votre sprint sera lancé avec la date "+this.data.sprint.dateLancement)){
      this.lancerSprint()
    }
  }


  //lancerNormalment le sprint dans la date de lancement
 
  lancerSprint(){
    this.data.sprint.etat = "en cours"
    this.data.sprint.productBacklogId = this.data.sprint.productBacklog.id
    this.sprintService.modifierSprint(this.data.sprint).subscribe(dataSprint =>{
      console.log(dataSprint);
      let  sprintBacklog = new SprintBacklog();
      sprintBacklog.velocite = dataSprint.velocite 
      sprintBacklog.sprint = dataSprint
      sprintBacklog.sprintId = this.data.sprint.id
      console.log("spb  : ",sprintBacklog);
      this.sprintBacklogService.genererSprintBacklog(sprintBacklog).subscribe(
         dataSpBacklog =>{
            let nbrHeurTotal = 0
            for(let i=0;i<this.data.TicketHistoires.length;i++){
              this.ticketTacheService.getListTicketTacheParHt(this.data.TicketHistoires[i].id).subscribe(
                data =>{
                  this.ticketTacheList = data
                  for(let j= 0;j<this.ticketTacheList.length;j++){
                    nbrHeurTotal+=this.ticketTacheList[j].nbHeurs
                    this.ticketTacheList[j].sprintBacklogId = dataSpBacklog.id
                    this.ticketTacheList[j].sprintBacklog = dataSpBacklog
                    this.ticketTacheService.modifierTicketTache(this.ticketTacheList[j]).subscribe(
                      ttData=>{
                        console.log(ttData);
                        
                      }
                    )
                  }
                }
              )
            }
            dataSpBacklog.nbrHeursTotal = nbrHeurTotal
            //modifier sprint backlog pour nbr heurs
            console.log(dataSpBacklog);
            this.sprintBacklogService.modifierSprintBackog(dataSpBacklog)
            .subscribe(dataSPB => console.log(dataSPB))
        }
      )
    })

  }

  //Supprimer le sprint
  supprimerSprint(){
    console.log(this.data.sprint.id);
    
    if(this.data.TicketHistoires.length>0){
      for(let i = 0;i<this.data.TicketHistoires.length;i++){
        this.detacherHt(this.data.TicketHistoires[i],i)
      }
    }
    this.sprintService.supprimerSprint(this.data.sprint.id).subscribe(
      data =>{
        console.log(data)
        this.dialogRef.close()
      }
      
    )
  }




}
