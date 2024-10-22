import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  storage : Window['localStorage'] | null = null;
  constructor() { 
    this.storage = window.localStorage;
  };
  setItem(key : string, value : string) : void{
    if (this.storage){
      this.storage.setItem(key,value)
    }
  };
  getItem(key:string) : string|null{
    if (this.storage){
      try{
        return this.storage.getItem(key)
      }finally{
        return null
      }
    }
    else{
      return null
    }
  };
  clear() : void{
    if (this.storage){
      this.storage.clear()
    }
  };
  removeItem(key:string) : void{
    if (this.storage){
      this.storage.removeItem(key);
    }
  };
}
