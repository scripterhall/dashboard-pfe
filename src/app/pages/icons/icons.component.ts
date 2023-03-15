import { animate, state, style, transition, trigger } from "@angular/animations";
import { SelectionModel } from "@angular/cdk/collections";
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from "@angular/cdk/drag-drop";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Sprint } from "src/app/model/sprint";
import { TicketHistoire } from "src/app/model/ticket-histoire";
import { SprintDialogPanelComponent } from "../dialogs/sprint-dialog-panel/sprint-dialog-panel.component";



export interface DialogData {
  sprint: Sprint;
  TicketHistoires:TicketHistoire[]
}

@Component({
  selector: "app-icons",
  templateUrl: "icons.component.html",
  styleUrls: ['./icons.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-in-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('fadeOut', [
      transition(':enter', [
        style({ width:  '*'}),
        animate('2.5s ease-in', style({ width: '*'}))
      ])
    ]),
    trigger('slideIn', [
      state('in', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
      ])
    ]),
    trigger('slideInSprint', [
      state('in', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(12%)' }),
        animate('0.6s ease-in-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0)' }),
        animate('0.6s ease-in-out', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
  
})


export class IconsComponent implements OnInit {
  histoireTicketsSprint: TicketHistoire[];
  
  constructor(public dialog: MatDialog) {}
  todo = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  done = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog'
  ];


  //sprint details
  openDialog(i:number) {
    
    const dialogRef = this.dialog.open(SprintDialogPanelComponent,{
      width: '600px',
      height:'690px',
      data: {sprint:this.sprints[i],
        TicketHistoires:this.histoireTicketsSprint
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }



  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
  }
  
  ngOnInit() {}

 
  sprints:Sprint[]=[
    new Sprint(),
    new Sprint(),
  ]

  elementCreated:boolean = false;
  @ViewChild('detailElement') detailElementRef!: ElementRef;
  @ViewChild('newElement') newElementRef!: ElementRef;
  @ViewChild('doneList') doneList!: CdkDropList;

  basculerElement(){


    this.elementCreated = !this.elementCreated;
    if(this.elementCreated){
      this.detailElementRef.nativeElement.classList.remove('col-lg-12');
      this.detailElementRef.nativeElement.classList.add('col-lg-7');
     
      
    }else{
      this.detailElementRef.nativeElement.classList.remove('col-lg-7');
      this.detailElementRef.nativeElement.classList.add('col-lg-12');
      this.detailElementRef.nativeElement.setAttribute('[@fadeOut]');
      
    }
  }
  clickCount = 0;;
  move(){
    this.sprints.push(new Sprint())
    this.clickCount++;
  }
}
