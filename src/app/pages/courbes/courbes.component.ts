import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Sprint } from 'src/app/model/sprint';
import { TicketHistoire } from 'src/app/model/ticket-histoire';
import { HistoireTicketService } from 'src/app/service/histoire-ticket.service';
import { ProductBacklogService } from 'src/app/service/product-backlog.service';
import { SprintService } from 'src/app/service/sprint.service';
import { Chart } from 'chart.js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-courbes',
  templateUrl: './courbes.component.html',
  styleUrls: ['./courbes.component.scss']
})


export class CourbesComponent implements OnInit {

  constructor() {
  }



  ngOnInit(): void {
  }
}
