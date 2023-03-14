import { ProductBacklog } from "./product-backlog";
import { Projet } from "./projet";
import { Ticket } from "./ticket";

export class TicketHistoire extends Ticket{


    public id?:number;
    public priorite?:string;//haute,faible,moyenne
    public date_debut?:Date;//date lancement de tache
    public date_fin?:Date;//date fin de tache
    public effort?:number;//planing pocker

    public productBacklogId?:number;
    public productBacklog?:ProductBacklog;
    public position?:number;

    public projetId?:number;
    public projet?:Projet;

}
