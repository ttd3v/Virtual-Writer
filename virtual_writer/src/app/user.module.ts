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
  about : string = 'hello world!'

  assign(key : string,default_value : string,storage : LocalStorageService) : string{
    let val : string = (storage.getItem(key) || default_value);
    if (storage.getItem(key) === null){
      storage.setItem(key,default_value);
    }
    return val
  }

  constructor(){
    this.storage = new LocalStorageService();
    this.theme = this.assign('theme','white',this.storage);
    this.username = this.assign('username','Username',this.storage);;
    this.about = this.assign('about','hello world!',this.storage);;
  }
}
