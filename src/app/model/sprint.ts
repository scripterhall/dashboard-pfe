import { SprintBacklog } from "./sprint-backlog";

export class Sprint {

    public id?:number;
    public date_lancement?:Date; // date de debut de traivail dans le sprint
    public date_fin?:Date ;//respecter le timebox
    public nbrEffortSprint?:number;//nombre d'effort prix dans le sprint
    public etat?:string;// sprint en cours , en pause ,annuler ...
    public sprintBacklog?:SprintBacklog //chaque sprint contient un sprint backlog couplage fort
    
}