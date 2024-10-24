import { Component } from '@angular/core';
import { UserModule } from '../../user.module';
import { response } from 'express';
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
  change_name(event : Event) : void{
    let user_module : UserModule = new UserModule();
    let input : HTMLInputElement|EventTarget|null = event.target;
    let value = (input as HTMLInputElement).value
    if(value.length >= 5 && value.length <= 20){
      this.username = String(value);
      fetch('http://localhost:5000/account_mutate',{
        method:"POST",
        headers:{'Content-Type':'application/bytes'},
        body: `mutation changeProfile{changeName(authKey:"${user_module.auth_key}" username:"${this.username}"){ok}}`
      })

    }else{
      (input as HTMLInputElement).value = this.username;
    }
    
  }
  change_about(event : Event) : void{
    let user_module : UserModule = new UserModule();
    let input : HTMLInputElement|EventTarget|null = event.target;
    let value = (input as HTMLInputElement).value
    if(value.length >= 0 && value.length <= 200){
      this.about = String(value);
      fetch('http://localhost:5000/account_mutate',{
        method:"POST",
        headers:{'Content-Type':'application/bytes'},
        body: `mutation changeProfile{changeAbout(authKey:"${user_module.auth_key}" about:"${this.about}"){ok}}`
      })

    }else{
      (input as HTMLInputElement).value = this.about;
    }
    
  }
  constructor(){
    let user_module : UserModule = new UserModule();
    if(user_module.authenticated === 'false'){
      window.location.replace('http://localhost:4200/login')
    }else{

      this.theme = user_module.theme
      this.username = user_module.username;
      this.about = user_module.about;
      fetch('http://localhost:5000/account',{
        method:"POST",
        headers: {"Content-Type":'application/string'},
        body: `query Account {user:userProfile(authKey:"${user_module.auth_key}"){username about}}`,
      })
      .then(response => response.json())
      .then(response => {
        let data = response['user']
        this.username = String(data['username']);
        this.about = String(data['about']);
      })

    }
  }
}
