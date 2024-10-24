import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from './local-storage.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})

export class UserModule {
  storage : null|LocalStorageService = null;
  theme : string = 'white';
  username : string = 'Username';
  about : string = 'hello world!';
  auth_key : string = 'auth_key';
  authenticated : string = 'false';

  assign(key : string,default_value : string,storage : LocalStorageService) : string{
    let val : string = (storage.getItem(key) || default_value);
    if (storage.getItem(key) === null){
      storage.setItem(key,default_value);
    }
    return val
  }
  login(authenticated : string, username : string, about : string, auth_key: string) : void{
    this.storage?.setItem('authenticated',authenticated);
    this.storage?.setItem('username',username);
    this.storage?.setItem('about',about);
    this.storage?.setItem('auth_key',auth_key);
  }
  logout() : void{
    if (this.storage){
      this.storage.clear()
    }
  }
  
  constructor(){
    this.storage = new LocalStorageService();
    
    this.theme = this.assign('theme','white',this.storage);
    this.username = this.assign('username','Username',this.storage);
    this.about = this.assign('about','hello world!',this.storage);
    this.auth_key = this.assign('auth_key','',this.storage);
    this.authenticated = this.assign('authenticated','false',this.storage)
  }
}
