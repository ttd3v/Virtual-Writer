import { Component } from '@angular/core';
import { UserModule } from '../user.module';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent {
  username : string = ''
  constructor(){
    let user : UserModule = new UserModule()
    if (user.authenticated !== 'true'){
      window.location.replace("http://localhost:4200");
    }
    if (user.username){
      this.username = user.username
    }

  }
}
