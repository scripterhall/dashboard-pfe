import { ChefProjet } from "./chef-projet";

export class Projet {

    public id?:number;//identifiant projet
    public nom?:String;//le nom de projet
    public date_debut?:Date //date debut de projet
    public date_fin?:Date //date fin de projet
    public cles ?:String //cles unique de projet
    public chefProjet?:ChefProjet //le realisateur de projet
}
