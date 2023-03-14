import { Personne } from "./personne";

export class ChefProjet extends Personne{

    public id?:number //identifiant chef de projet
    public listProject?:any //liste de projet initialise par le chef de projet
}
