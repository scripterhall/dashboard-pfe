import { ProductBacklog } from "./product-backlog";
import { Projet } from "./projet";
import { Sprint } from "./sprint";
import { Ticket } from "./ticket";

export class TicketHistoire extends Ticket{


    public id?:number;
    public priorite?:string;//haute,faible,moyenne
    public dateDeb?:Date;//date lancement de tache
    public dateFin?:Date;//date fin de tache
    public effort?:number;//planing pocker
    public position?:number;//our ordonner le product backlog
    public productBacklogId?:number;
    public productBacklog?:ProductBacklog;
    public sprintId?:number;
    public sprint?:Sprint;

  

}
