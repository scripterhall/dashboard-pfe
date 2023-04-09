import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Sprint } from 'src/app/model/sprint';
import { TicketHistoire } from 'src/app/model/ticket-histoire';
import { HistoireTicketService } from 'src/app/service/histoire-ticket.service';
import { ProductBacklogService } from 'src/app/service/product-backlog.service';
import { SprintService } from 'src/app/service/sprint.service';
import { Chart, ChartData, ChartOptions } from 'chart.js';
@Component({
  selector: 'app-courbes',
  templateUrl: './courbes.component.html',
  styleUrls: ['./courbes.component.scss']
})
export class CourbesComponent implements OnInit {

  // constructor(sprintService:SprintService,
  //   productBacklogService:ProductBacklogService,
  //   histoireTicketService:HistoireTicketService) { }

  //   sprints: Sprint[];
  //   chart: Chart;

  //   ngOnInit() {
  //     this.sprintService.getListSprintsByProductBacklog(this.productBacklogService.getProductBacklogByIdFromLocalStorage()).subscribe((sprints: Sprint[]) => {
  //       this.sprints = sprints;

  //       // Générer un graphique Burn Down pour chaque sprint
  //       for (let i = 0; i < this.sprints.length; i++) {
  //         const sprint = this.sprints[i];

  //         this.histoireTicketService.getHistoireTicketBySprintId(sprint.id).subscribe((tickets: TicketHistoire[]) => {
  //           // Générer un graphique Burn Down pour ce sprint et sa liste de tickets associée
  //           console.log(tickets);
  //           const labels = [];
  //           const data = [];
  //           let remainingEffort = sprint.velocite;
  //           labels.push(sprint.dateLancement);
  //           data.push(remainingEffort);

  //           for (let j = 0; j < tickets.length; j++) {
  //             remainingEffort -= tickets[j].effort;
  //             labels.push(tickets[j].dateFin);
  //             console.log(tickets[j].dateFin);

  //             data.push(remainingEffort);

  //           }
  //           labels.push(sprint.dateFin);
  //           data.push(0);

  //           const chart = new Chart(`canvas-${sprint.id}`, {
  //             type: 'line',
  //             data: {
  //               labels: labels,
  //               datasets: [
  //                 {
  //                   label: 'Effort restant',
  //                   data: data,
  //                   borderColor: 'blue',
  //                   fill: false
  //                 },
  //                 {
  //                   label: 'Tendance idéale',
  //                   data: this.generateIdealTrend(sprint),
  //                   borderColor: 'green',
  //                   fill: false
  //                 }
  //               ]
  //             },
  //             options: {
  //               title: {
  //                 display: true,
  //                 text: `Burn Down Chart - Sprint ${sprint.id}`
  //               },
  //               scales: {
  //                 xAxes: [{
  //                   type: 'time',
  //                   time: {
  //                     unit: 'day',
  //                     tooltipFormat: 'll'
  //                   }
  //                 }],
  //                 yAxes: [{
  //                   ticks: {
  //                     beginAtZero: true,
  //                     stepSize: 1
  //                   }
  //                 }]
  //               }
  //             }
  //           });
  //         });
  //       }
  //     });
  //   }

  // // Générer la tendance idéale (droite qui part de la vélocité et atteint 0 à la fin du sprint)
  // generateIdealTrend(sprint: Sprint): any[] {
  //   const idealTrend = [];
  //   idealTrend.push({ x: sprint.dateLancement, y: sprint.velocite });
  //   idealTrend.push({ x: sprint.dateFin, y: 0 });
  //   return idealTrend;
  // }

  @ViewChild('myChart', { static: true }) myChart: ElementRef<HTMLCanvasElement>;

  constructor(private sprintService:SprintService,
    private productBacklogservice:ProductBacklogService,
    private histoireTicketService:HistoireTicketService,
    ) { }

    sprintsProjet:Sprint[];
    tickets:TicketHistoire[]=[];

    ngOnInit(){
    //Pour la deuxième courbe
    this.histoireTicketService.getListHistoireTicketByProductBacklog(this.productBacklogservice.getProductBacklogByIdFromLocalStorage()).subscribe(
      data => {
          this.tickets = data;
          console.log(this.tickets);
      },
      error => {
        console.log(error);
      }
    );

    this.sprintService.getListSprintsByProductBacklog(this.productBacklogservice.getProductBacklogByIdFromLocalStorage()).subscribe(
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

  //Pour la deuxième courbe
  getChartData(): ChartData {
    const labels = this.sprintsProjet.map(sprint => 'sp' + sprint.id);
    const data = {
    labels: labels,
    datasets: [
      {
        label: 'Effort terminé',
        data: this.getScopeCreepData(),
        fill: false,
        borderColor: 'red'},
      {
        label: 'Effort planifié',
        data: this.getEffortPlanifieData(),
        fill: false,
        borderColor: 'green'
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
      title: {
        display: true,
        text: 'Burn-up chart'
      },
      scales: {
      xAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Sprints'
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: 'Efforts (en points )'
        },
        ticks: {
          beginAtZero: true
        }
      }]
      }
      };
  }


}

