import {Routes} from '@angular/router';
import {LoginComponent} from './auth/login/login.component';
import { ChatComponent } from './pages/chat/chat.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: 'login', component:LoginComponent },
  { path: 'chat/:id', component: ChatComponent },
  { path: 'home', component: HomeComponent },
  { path: '', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
