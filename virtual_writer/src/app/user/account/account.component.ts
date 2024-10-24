import { Component } from '@angular/core';
import { UserModule } from '../../user.module';
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  theme : string = 'white'; 
  username : string = 'Username';
  about : string = 'About';
  change_theme() : void {
    localStorage.setItem('theme',localStorage.getItem('theme')=='white'?'dark':'white');
    console.log(localStorage.getItem('theme'));
    if(window){
      window.location.reload()
    }
  }
  constructor(){
    let user_module : UserModule = new UserModule();
    this.theme = user_module.theme
    this.username = user_module.username;
    this.about = user_module.about
  }
}
