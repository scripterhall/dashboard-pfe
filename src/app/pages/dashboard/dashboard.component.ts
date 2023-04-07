import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { Projet } from "src/app/model/projet";
import { Sprint } from "src/app/model/sprint";
import { TicketHistoire } from "src/app/model/ticket-histoire";
import { HistoireTicketService } from "src/app/service/histoire-ticket.service";
import { ProductBacklogService } from "src/app/service/product-backlog.service";
import { ProjetServiceService } from "src/app/service/projet-service.service";
import { SprintService } from "src/app/service/sprint.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "dashboard.component.html",
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public canvas : any;
  public ctx;
  public datasets: any;
  public data: any;
  public myChartData;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clicked2: boolean = false;

  //Pour la deuxième courbe
  sprintsProjet:Sprint[];
  tickets:TicketHistoire[]=[];
  @ViewChild('myChart', { static: true }) myChart: ElementRef;


  constructor(private sprintService:SprintService,
    private productBacklogService:ProductBacklogService,
    private histoireTicketService:HistoireTicketService, private projetService:ProjetServiceService) {}
    sprints: Sprint[]=[];
    chart: Chart;
    sprintSelectedIndex:number;
    projet:Projet;

    ngOnInit() {
      const storedObject = localStorage.getItem("projetCourant");
      const parsedObject = JSON.parse(storedObject);
      this.projet = parsedObject;

      this.productBacklogService.getProductBacklogByIdProjet(this.projetService.getProjetByIdFromLocalStorage()).subscribe(
        data => {
          const productBacklog = data;
          localStorage.setItem('productBacklogCourant', JSON.stringify(productBacklog));
        },
        error => {
          console.log('Une erreur s\'est produite lors de la récupération du product backlog : ', error);
        }
      );

      this.sprintService.getListSprintsByProductBacklog(this.productBacklogService.getProductBacklogByIdFromLocalStorage()).subscribe((sprints: Sprint[]) => {
        if (sprints.length > 0) {
          this.sprintSelectedIndex=0;
          this.sprints = sprints;

        if(this.sprints.length!=0){
        for (let i = 0; i < this.sprints.length; i++) {
          const sprint = this.sprints[i];

          this.histoireTicketService.getHistoireTicketBySprintId(sprint.id).subscribe((tickets: TicketHistoire[]) => {
            const labels = [];
            const data = [];
            let remainingEffort = sprint.velocite;
            labels.push(new Date(sprint.dateLancement));
            data.push(remainingEffort);

            for (let j = 0; j < tickets.length; j++) {
              remainingEffort -= tickets[j].effort;
              console.log('Date fin ticket = ' + new Date(tickets[j].dateFin).toLocaleDateString());
              labels.push(new Date(tickets[j].dateFin));

              data.push(remainingEffort);
            }
            labels.push(new Date(sprint.dateFin));
            data.push(0);

            const chart = new Chart(`canvas-${sprint.id}`, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [
                  {
                    label: 'Effort restant',
                    data: data,
                    borderColor: 'orange',
                    fill: false
                  },
                  {
                    label: 'Tendance idéale',
                    data: this.generateIdealTrend(sprint),
                    borderColor: '#00d6b4',
                    fill: false
                  }
                ]
              },
              options: {
                title: {
                  display: true,
                  text: `Burn Down Chart`,
                  fontSize: 20,
                  fontColor: 'rgb(226, 226, 226)'
                },
                responsive: true,
                scales: {
                  xAxes: [{
                    type: 'time',
                    time: {
                      unit: 'day',
                      tooltipFormat: 'll'
                    },

                    scaleLabel: {
                      display: true,
                      labelString: 'Jours de sprint',
                      fontColor: 'rgb(226, 226, 226)',
                      fontSize:14
                    },
                    ticks: {
                      beginAtZero: true,
                      stepSize:1
                    },
                  }],
                  yAxes: [{
                    ticks: {
                      beginAtZero: true,
                      stepSize: 1,
                    },
                    scaleLabel: {
                      display: true,
                      labelString: 'Effort restant (points)',
                      fontColor: 'rgb(226, 226, 226)',
                      fontSize: 14
                    }
                  }]
                }
              }
            });
          });
        }
      }
      }});

    this.histoireTicketService.getListHistoireTicketByProductBacklog(this.productBacklogService.getProductBacklogByIdFromLocalStorage()).subscribe(
      data => {
          this.tickets = data;
          console.log(this.tickets);

          this.tickets.sort((a, b) => {
            if (a.dateFin > b.dateFin) {
              return 1;
            } else if (a.dateFin < b.dateFin) {
              return -1;
            } else {
              return 0;
            }
          });

          console.log(this.tickets);
      },
      error => {
        console.log(error);
      }
    );


    this.sprintService.getListSprintsByProductBacklog(this.productBacklogService.getProductBacklogByIdFromLocalStorage()).subscribe(
      data => {
        if (data.length > 0) {
          this.sprintsProjet = data;
          console.log(this.sprintsProjet);
        } else {
          console.log('Pas de sprints !');
        }
        const myChart = new Chart(this.myChart.nativeElement.getContext('2d'), {
          type: 'line',
          data: this.getChartData(),
          options: this.getChartOptions()
        });
      },
      error => {
        console.log(error);
      }
    );
  }

    onSprintSelected(index: number) {
      if(this.sprints && this.sprints.length>0){
        this.sprintSelectedIndex = index;
      }
    }

  public updateOptions() {
    this.myChartData.data.datasets[0].data = this.data;
    this.myChartData.update();
  }

  private generateIdealTrend(sprint: Sprint): any[] {
    const idealTrend = [];
    idealTrend.push({ x: sprint.dateLancement, y: sprint.velocite });
    idealTrend.push({ x: sprint.dateFin, y: 0 });
    return idealTrend;
  }

  //Pour la deuxième courbe
  getChartData(): ChartData {
    const ctx = this.myChart.nativeElement.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 230, 0, 50);

    gradient.addColorStop(1, 'rgba(233,32,16,0.2)');
    gradient.addColorStop(0.4, 'rgba(233,32,16,0.0)');
    gradient.addColorStop(0, 'rgba(233,32,16,0)'); //red colors

    const labels = this.sprintsProjet.map((sprint, index) => 'Sprint' + (index + 1));
    const data = {
    labels: labels,
    datasets: [
      {
        pointHoverRadius: 6,
        pointBorderWidth: 1.5,
        pointHoverBackgroundColor: 'gray',
        label: 'Effort terminé',
        data: this.getScopeCreepData(),
        fill: false,
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        backgroundColor: gradient,
        pointBackgroundColor: '#ec250d',
        pointBorderColor: 'rgba(255,255,255,0)',
        borderColor: '#ec250d'
      },
      {
        label: 'Effort planifié',
        data: this.getEffortPlanifieData(),
        fill: false,
        borderColor: 'green',
        pointBorderWidth: 1.5,
      }]};
      return data;
    }

    getScopeCreepData() {
      const scopeCreepData: number[] = [];
      let scopeCreepTotal = 0;
        for (const sprint of this.sprintsProjet) {
          const userStoriesInSprint = this.tickets.filter(us => us.sprintId === sprint.id);
          const scopeCreepInSprint = userStoriesInSprint.reduce((acc, us) => acc + (us.effort * (us.status === 'TERMINE' ? 1 : 0)), 0);
          scopeCreepTotal = scopeCreepTotal + scopeCreepInSprint;
          scopeCreepData.push(scopeCreepTotal);
        }
      return scopeCreepData;
    }

    getEffortPlanifieData(){
      if(this.sprintsProjet && this.sprintsProjet.length>0){
        const effortPlanifieData: number[] = [];
        let effortPlanifieTotal = 0;
        for (const sprint of this.sprintsProjet) {
          effortPlanifieTotal += sprint.velocite;
          effortPlanifieData.push(effortPlanifieTotal);
        }
        return effortPlanifieData;
      }
    }

    getChartOptions(): ChartOptions {
      return {
      responsive: true,
        tooltips: {
          backgroundColor: '#f5f5f5',
          titleFontColor: '#333',
          bodyFontColor: '#666',
          bodySpacing: 4,
          xPadding: 14,
          mode: "nearest",
          intersect: 0,
          position: "nearest"
        },
      title: {
        display: true,
        text: 'Burn-up chart',
        fontSize: 20,
        fontColor: 'rgb(226, 226, 226)'
      },
      scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Sprints',
          fontColor: 'rgb(226, 226, 226)',
          fontSize: 14
        }
      }],
      yAxes: [
        {
        scaleLabel: {
          display: true,
          labelString: 'Efforts (en points )',
          fontColor: 'rgb(226, 226, 226)',
          fontSize: 14
        },
        ticks: {
          beginAtZero: true,
        }
      }]
      }
      };
  }
}
