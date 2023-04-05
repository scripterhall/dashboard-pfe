import { Personne } from "./personne";

export class Membre extends Personne {

    public id?:number // idantifiant membre
    public etat?:string //etat actif non actif dans le projet
    public dateInscription?:Date //date d'inscription dans l'app 
    
}
