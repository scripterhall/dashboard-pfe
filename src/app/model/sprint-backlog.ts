import { Backlog } from "./backlog";
import { Sprint } from "./sprint";
import { TacheTicket } from "./tache-ticket";

export class SprintBacklog extends Backlog {

    public id?:number; //identifiant de sprint backlog
    public nbrHeursTotal?:number; // nombre d'heurs total de travail dans le sprint
    public ticketTache?:TacheTicket[]; //liste des ticket tache de sprint backlog
    public sprint?:Sprint
}
