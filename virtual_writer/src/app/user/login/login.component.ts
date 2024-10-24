import { Component } from '@angular/core';
import { UserModule } from '../../user.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email : string = '';
  password : string = '';
  user : UserModule = new UserModule();
  isvalid_password(event : Event) : void{
    if (event.target !== null){
      let input : HTMLInputElement = (event.target as HTMLInputElement);
      this.password = input.value
      input.className = String(input.value).length >= 8? 'valid_input' : 'invalid_input'
    }
  }
  isvalid_email(event : Event) : void{
    if (event.target !== null){
      let input : HTMLInputElement = (event.target as HTMLInputElement)
      if (typeof input){
        let value : string = String(input.value);
        if (value.length > 0){
          const regex = /^[^\s@]{5,}@[^\s@]+\.[^\s@]+$/;
          const valid : boolean = regex.test(value);
          input.className = valid? 'valid_input' : 'invalid_input';
          this.email = input.value;
        }else{
          input.className = ""
        }
      }
    }
  }
  login () : void{
    if (document.getElementsByClassName('valid_input').length === 2){
      fetch("http://localhost:5000/login",{
        method:'POST',
        headers: {"Content-Type":'application/json'},
        body: JSON.stringify({'email':this.email,'password':this.password})
      }).then(response=>response.json())
      .then(data => {
        if('ok' in data){
          if(data['ok']){
            if(data['authenticated'] === 'true'){
              this.user.login(
                data['authenticated'],
                data['username'],
                data['about'],
                data['auth_key'],
              )
              window.location.replace('http:localhost:4200/projects');
            }
          }else{
            alert('Something went wrong, maybe you misspelled something. Please try again');
          }
        }
      })
    }
  }
}
