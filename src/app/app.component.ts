import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import {ContactComponent } from './contact/contact.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LoginComponent,ContactComponent,RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'listContact';
}
