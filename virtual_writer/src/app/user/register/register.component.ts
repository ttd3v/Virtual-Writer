import { Component } from '@angular/core';
import { response } from 'express';
import { error } from 'node:console';
import { EventEmitter } from 'node:stream';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email = ''
  username = ''
  password = ''
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
  isvalid_username(event : Event) : void{
    if (event.target !== null){
    let input : HTMLInputElement = (event.target as HTMLInputElement);
    let content : string = String(input.value)
    input.className = (content.length > 4 && content.length <= 20 && content.split(' ').length === 1)?'valid_input':'invalid_input';
    this.username = input.value
    if (content.length === 0){
      input.className = ''
    }
  }
  }
  isvalid_password(event : Event) : void{
    if (event.target !== null){
      let input : HTMLInputElement = (event.target as HTMLInputElement);
      this.password = input.value
      input.className = String(input.value).length >= 8? 'valid_input' : 'invalid_input'
    }
  }
  isvalid_confirmpassword(event : Event){
    if (event.target !== null){
      let input : HTMLInputElement = (event.target as HTMLInputElement);
      input.className = (String(input.value).length >= 8 && input.value === this.password)? 'valid_input' : 'invalid_input'
    }
  }
  submit(){
    if(document.getElementsByClassName('valid_input').length === 4){
      fetch("http://127.0.0.1:5000/newuser",{
        method: "POST",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({'email':this.email,'password':this.password,'username':this.username})
      })
      .then(response => {
        if (!response.ok){
          console.error(`Response wasn't ok | Status:${response.status} - StatusText:${response.statusText}`)
        }
        return response
        
      })
      .then(response => response.json())
      .then(data => {
        if ('ok' in data && data['ok'] === true){
          localStorage.setItem('auth_key',data['auth_key']);
          localStorage.setItem('username',data['username']);
          localStorage.setItem('age',data['age']);
          window.location.replace('http://localhost:4200/dashboard')
        }else if('ok' in data && data['ok'] === false){
          alert("fail")
        }
      })
    }
  }
}
