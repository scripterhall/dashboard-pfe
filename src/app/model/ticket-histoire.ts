import { Projet } from "./projet";
import { Ticket } from "./ticket";

export class TicketHistoire extends Ticket{


    public id?:number;
    public priorite?:string;//haute,faible,moyenne
    public date_debut?:Date;//date lancement de tache
    public date_fin?:Date;//date fin de tache
    public effort?:number;//planing pocker
    public projet?:Projet;//a quelle projet appartient le ticket


}
