import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  jwt:null|string = null;
  constructor() {
    this.jwt = localStorage.getItem('jwt');
    
  }
}
