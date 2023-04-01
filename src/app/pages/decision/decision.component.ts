import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RolePk } from 'src/app/model/keys/role-pk';
import { Role } from 'src/app/model/role';
import { MembreService } from 'src/app/service/membre.service';
import { RoleService } from 'src/app/service/role.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-decision',
  templateUrl: './decision.component.html',
  styleUrls: ['./decision.component.scss']
})
export class DecisionComponent implements OnInit {

  constructor(private route:ActivatedRoute,
              private router:Router,
              private roleService:RoleService,
              private membreService:MembreService){}

  idProjet:number;
  idMembre:number;
  role:Role;
  
  ngOnInit(): void {
    this.idProjet = this.route.snapshot.params['idProjet'];
    this.idMembre = this.route.snapshot.params['idMembre'];
    const rolePk:RolePk = {
      membreId: this.idMembre,
      projetId: this.idProjet,
    }
   



    this.roleService.afficherRole(rolePk).subscribe(
      data =>{
        console.log(data);
        this.role = data;
      }
    )
  }

  accepter(){
    this.role.status = "ACCEPTE"
    this.roleService.modifierRole(this.role).subscribe(
      data =>{
        console.log(data);
        
        this.membreService.getMembreById(this.idMembre).subscribe(
          data =>{
            localStorage.setItem('membre',JSON.stringify(data))
            this.router.navigateByUrl('/dashboard')
          }
        )
      }
    )
  }

  refuser(){
    this.membreService.supprimerMembre(this.idMembre).subscribe(
    data =>console.log(data) )
    this.roleService.supprimerRole(this.role.pk).subscribe(
      data =>{
        Swal.fire(
          'Refus',
          'Vous avez rejeté l offre',
          'warning'
        ).then(
          result => {
            if (result.isConfirmed)
            window.location.href = 'https://www.numeryx.fr/fr/numeryx-technologies-inaugure-filiale-tunisie'
          }
        )
      }
    )  

  }

}
