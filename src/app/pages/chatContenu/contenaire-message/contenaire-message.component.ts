import { Component, Input, OnInit } from '@angular/core';
import { ChefProjet } from 'src/app/model/chef-projet';
import { Membre } from 'src/app/model/membre';
import { Reponse } from 'src/app/model/reponse';
import { ChatBotService } from 'src/app/service/chat-bot.service';


@Component({
  selector: 'app-contenaire-message',
  templateUrl: './contenaire-message.component.html',
  styleUrls: ['./contenaire-message.component.scss']
})
export class ContenaireMessageComponent implements OnInit {
  @Input() reponseActuelle:Reponse;
  reponses:Reponse[]=[]
  constructor(
    private chatBotService: ChatBotService
  ){}
  membre:Membre = JSON.parse(localStorage.getItem('membre'))
  chefProjet:ChefProjet = JSON.parse(localStorage?.getItem('chefProjet'))

  ngOnInit(): void {

    this.chatBotService.recuperListeReponseMembre(1).subscribe(
      data => {
        for(let rep of data){
          if (/\<[^\>]+\>/.test(rep.text)) {
            rep.useHtml = false;
          } else {
            rep.useHtml = true;
            rep.text = rep.text.replace(/\n/g, '<br>');
          }
        }
        this.reponses = data
      }
    )
    
  }

  ngOnChanges() {
    if (this.reponseActuelle) {
      this.reponses.push(this.reponseActuelle);
      console.log(this.reponseActuelle);
    }
  }

}
