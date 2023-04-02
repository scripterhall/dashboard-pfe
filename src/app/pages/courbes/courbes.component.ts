import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { Sprint } from 'src/app/model/sprint';
import { TicketHistoire } from 'src/app/model/ticket-histoire';
import { HistoireTicketService } from 'src/app/service/histoire-ticket.service';
import { ProductBacklogService } from 'src/app/service/product-backlog.service';
import { SprintService } from 'src/app/service/sprint.service';

@Component({
  selector: 'app-courbes',
  templateUrl: './courbes.component.html',
  styleUrls: ['./courbes.component.scss']
})
export class CourbesComponent implements OnInit {
  constructor(private sprintService:SprintService,
    private productBacklogService:ProductBacklogService,
    private histoireTicketService:HistoireTicketService) { }

    sprints: Sprint[];
    chart: Chart;

    ngOnInit() {
      this.sprintService.getListSprintsByProductBacklog(this.productBacklogService.getProductBacklogByIdFromLocalStorage()).subscribe((sprints: Sprint[]) => {
        this.sprints = sprints;

        // Générer un graphique Burn Down pour chaque sprint
        for (let i = 0; i < this.sprints.length; i++) {
          const sprint = this.sprints[i];

          this.histoireTicketService.getHistoireTicketBySprintId(sprint.id).subscribe((tickets: TicketHistoire[]) => {
            // Générer un graphique Burn Down pour ce sprint et sa liste de tickets associée
            console.log(tickets);
            const labels = [];
            const data = [];
            let remainingEffort = sprint.velocite;
            labels.push(sprint.dateLancement);
            data.push(remainingEffort);

            for (let j = 0; j < tickets.length; j++) {
              remainingEffort -= tickets[j].effort;
              labels.push(tickets[j].dateFin);

              data.push(remainingEffort);

            }
            labels.push(sprint.dateFin);
            data.push(0);

            const chart = new Chart(`canvas-${sprint.id}`, {
              type: 'line',
              data: {
                labels: labels,
                datasets: [
                  {
                    label: 'Effort restant',
                    data: data,
                    borderColor: 'blue',
                    fill: false
                  },
                  {
                    label: 'Tendance idéale',
                    data: this.generateIdealTrend(sprint),
                    borderColor: 'green',
                    fill: false
                  }
                ]
              },
              options: {
                title: {
                  display: true,
                  text: `Burn Down Chart - Sprint ${sprint.id}`
                },
                scales: {
                  xAxes: [{
                    type: 'time',
                    time: {
                      unit: 'day',
                      tooltipFormat: 'll'
                    }
                  }],
                  yAxes: [{
                    ticks: {
                      beginAtZero: true,
                      stepSize: 1
                    }
                  }]
                }
              }
            });
          });
        }
      });
    }

  // Générer la tendance idéale (droite qui part de la vélocité et atteint 0 à la fin du sprint)
  private generateIdealTrend(sprint: Sprint): any[] {
    const idealTrend = [];
    idealTrend.push({ x: sprint.dateLancement, y: sprint.velocite });
    idealTrend.push({ x: sprint.dateFin, y: 0 });
    return idealTrend;
  }
}
