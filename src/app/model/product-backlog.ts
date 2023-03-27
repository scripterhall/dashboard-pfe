import { Backlog } from "./backlog";
import { TicketHistoire } from "./ticket-histoire";

export class ProductBacklog extends Backlog {

    public id?:number;//identifiant de backlog
    public dateCreation?:Date;//Date de création du productbacklog
    public nbrSprint?:number;//total nombre de sprint
    public histoireTickets:TicketHistoire[]//les histoireTicket appartenant au backlog

}
