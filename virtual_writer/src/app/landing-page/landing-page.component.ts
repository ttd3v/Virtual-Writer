import { Component } from '@angular/core';
import { UserModule } from '../user.module';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
  theme : string = 'white'; 
  constructor(){
    let user_module : UserModule = new UserModule();
    this.theme = user_module.theme
  }
}
