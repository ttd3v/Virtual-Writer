import { Routes } from '@angular/router';
import { AccountComponent } from './user/account/account.component';
import { LoginComponent } from './user/login/login.component';
import { RegisterComponent } from './user/register/register.component';
import { LandingPageComponent } from './landing-page/landing-page.component';

export const routes: Routes = [
    {path:'account', component:AccountComponent},
    {path:'login', component:LoginComponent},
    {path:'register', component:RegisterComponent},
    {path:'home', component:LandingPageComponent},
    {path:'**', redirectTo:'home'}
];
