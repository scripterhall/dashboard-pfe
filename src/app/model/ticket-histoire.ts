import { Membre } from "./membre";
import { ProductBacklog } from "./product-backlog";
import { Projet } from "./projet";
import { Sprint } from "./sprint";
import { Ticket } from "./ticket";

export class TicketHistoire extends Ticket{


    public id?:number;
    public priorite?:string;//haute,faible,moyenne
    public effort?:number;//planing pocker

    public productBacklogId?:number;
    public productBacklog?:ProductBacklog;

    public sprintId?:number;
    public sprint?:Sprint;

    public position?:number;
    public membreId?:number;
}
