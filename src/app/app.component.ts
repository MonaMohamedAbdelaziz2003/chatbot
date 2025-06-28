import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatComponent } from "./pages/chat/chat.component";
// import { LoginComponent } from "./auth/login/login.component";
// import { RegisterComponent } from "./auth/register/register.component";
// import { ChatComponent } from "./pages/chat/chat.component";
// import { HomeComponent } from "./pages/home/home.component";

@Component({
  selector: 'app-root',
  imports: [ RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'chatbot';
}
