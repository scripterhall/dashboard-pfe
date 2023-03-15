import { Membre } from "./membre";
import { SprintBacklog } from "./sprint-backlog";
import { Ticket } from "./ticket";

export class TacheTicket extends Ticket{

    public id?:number ; //idantifiant de tache ticket
    public nbrHeurs?:number ;//nombnre d heurs 
    public membre?:Membre; // a quel membere est affecter le ticket
    public membreId?:number;
    public etat?:string;
    public sprintBacklogId?:number;
    public sprintBacklog?:SprintBacklog //dans quelle sprintBacklog appartient

}
