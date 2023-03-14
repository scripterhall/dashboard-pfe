import { ChefProjet } from "./chef-projet";
import { Membre } from "./membre";
import { Role } from "./role";

export class Invitation {


    public id?:number;//identifiant de l'invitee
    public emailInvitee:String; // l'email pour acheminer l'invitation
    public role:Role;//le role de l'inviter dans le projet
    public chefProjet:ChefProjet// qui a envoyer l'invitation
    public membre:Membre//l'invitee
    

}
