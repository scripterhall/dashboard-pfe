import { DialogModule } from '@angular/cdk/dialog';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChartDataSets, ChartOptions, ChartType ,Chart} from 'chart.js';
import { Observable,forkJoin } from 'rxjs';
import { StatCourbComponent } from 'src/app/pages/dialogs/stat-courb/stat-courb.component';
import { Membre } from 'src/app/model/membre';
import { Role } from 'src/app/model/role';
import { TacheTicket } from 'src/app/model/tache-ticket';
import { HistoireTicketService } from 'src/app/service/histoire-ticket.service';
import { MembreService } from 'src/app/service/membre.service';
import { RoleService } from 'src/app/service/role.service';
import { TicketTacheService } from 'src/app/service/ticket-tache.service';
import { TicketHistoire } from 'src/app/model/ticket-histoire';

export interface ChartDialog{
  membre:Membre,
  histoire:TicketHistoire
}

@Component({
  selector: 'app-histoire-membre-chart',
  templateUrl: './histoire-membre-chart.component.html',
  styleUrls: ['./histoire-membre-chart.component.scss']
})
export class HistoireMembreChartComponent implements OnInit   {

  bubbleChartData: ChartDataSets[] = [];
  @Input("sprintId")sprintId:number;

  colors = [
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)'
  ];


  bubbleChartLegend = true;

  bubbleChartPlugins = [];
  chart: Chart;
  listMembre: Membre[];
  listTicketHistoire:TicketHistoire[]=[];
  constructor(
    private dialog:MatDialog,
    private roleService: RoleService,
    private ticketTacheService: TicketTacheService
  ){}

   generateColors(numColors) {
    let colors = [];

    for (let i = 0; i < numColors; i++) {
      let color = "#" + ((1 << 24) * Math.random() | 0).toString(16);
      colors.push(color);
    }

    this.colors = colors
  }

  ngOnInit(): void {
    const idProjet = JSON.parse(localStorage.getItem('projet')).id
    const ticketsObservable: Observable<TacheTicket[]>= this.ticketTacheService.getTicketsTacheBySprint(this.sprintId)
    const roleObservable:Observable<Role[]> = this.roleService.afficherListRoleParProjet(idProjet);

    // Utilisation de forkJoin pour attendre la récupération de toutes les données

    forkJoin([roleObservable, ticketsObservable])
  .subscribe(
    ([roles,tickets])=>{
      //recuoerer les membre par role
      const membres = []
      this.generateColors(roles.length);
      for(let role of roles)
        membres.push(role.membre)
        this.listMembre = membres
      console.log(membres);

      const bubbleChartData = [];
      //ajouté dans le graphe
      const membersAdded = [];
      const historiesAdded = [];
      for (let i = 0; i < membres.length; i++) {
        const  memberData = { data: [], label: membres[i].email, backgroundColor: this.colors[i], borderColor: this.colors[i] };
        for (let j = 0; j < tickets.length; j++) {
          const tache = tickets[j];
          if (tache && tache.membreId === membres[i].id) {
            const historyIndex = historiesAdded.find(histoire => histoire.id == tache.ht.id)
            if (historyIndex == null) {
              this.listTicketHistoire.push(tache.ht);
              historiesAdded.push(tache.ht);
              memberData.data.push({ x: i, y: tache.ht.id,r:10,pointStyle: 'fa-user'});
            } else {
              // Histoire de ticket déjà présente, on ignore cette histoire de ticket et on passe à l'itération suivante
              memberData.data.push({ x: i,y: tache.ht.id,r:10,pointStyle: 'fa-user'});

            }
            if (membersAdded.indexOf(membres[i].id) === -1) {
              // Membre non présent, on l'ajoute au tableau des membres
              membersAdded.push(membres[i].id);
            }


          }
        }

          bubbleChartData.push(memberData);
          console.log(bubbleChartData);

      }
      //conf
      const chartOptions = {
        scales: {
          yAxes: [{
            min: 0,
            max: tickets.length,
            scaleLabel: {
              display: true,
              labelString: 'Histoire de ticket'
            },

            ticks: {
              autoSkip:true,
              beginAtZero: true,
              stepsSize:1,
              callback: function(value, index, values) {
                console.log(historiesAdded);

                return historiesAdded[index]?.titre;
              }
            },
            gridLines: {
              display:true,
              drawBorder: true,
              color: 'rgba(200, 200, 200, 0.2)',
              drawOnChartArea: true,
              drawTicks: true }
          }],
          xAxes: [{

            scaleLabel: {
              display: true,
              labelString: 'Membre'
            },
            ticks: {
              stepSize: 1 ,
              beginAtZero: false,
              min: 0, // La première valeur sera 0
              callback: function(value, index, values) { // Personnalisation des labels
                return membres[index]?.email;
              }
            },
            gridLines: {
              display:true,
              drawBorder: true,
              color: 'rgba(200, 200, 200, 0.2)',
              drawOnChartArea: true,
              drawTicks: true
            }
          }]
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const datasetLabel = data.datasets[tooltipItem.datasetIndex].label;
              const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];

              const memberName = membres[value.x].email;
              const ticketTitle = historiesAdded.find(histoire=>histoire.id == value.y).titre
              return `${memberName}: ${ticketTitle}`;
            }
          }
        },

        elements: {
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 10,
            backgroundColor: '',
            borderWidth: 0,
            borderColor: 'transparent',
            pointStyle: 'mat-icon',
            icon: 'person',
            fontColor: 'white', // couleur de la légende
            fontSize: 20, // taille de l'icône
            fontStyle: 'normal', // style de l'icône
         }

        },
        onClick: this.handleChartClick.bind(this)
      };

      //creation
      this.canvas = document.getElementById("bubble-chart");
      this.ctx = this.canvas.getContext("2d");

      this.chart = new Chart(this.ctx, {
        type: 'bubble',
        data: {
          datasets: bubbleChartData
        },
        options: chartOptions
      });


    }
  )

  }
  public canvas : any;
  public ctx;

  handleChartClick(event, array) {
    const elements = this.chart.getElementAtEvent(event);
    let member;
    let ticketHistoire;
    if (elements.length > 0) {
      //pour l'axe des x
      const datasetIndex = elements[0]._datasetIndex;

      //pour l'axe des y
      const dataIndexYaxe = elements[0]._index;
      //affectation des valuer
      member = this.listMembre[datasetIndex]
      ticketHistoire = this.listTicketHistoire[dataIndexYaxe]
    }

    if (array.length > 0) {
      const dialogRef = this.dialog.open(StatCourbComponent, {
        width: '650px',
        height:'570px',
        data: {
          membre: member,
          histoire:ticketHistoire
        }
      });
    }
  }
}
