import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginObj: any = {
    email: "",
    password: "",
  };

  signupUsers: any[] = [];

  constructor() { }

  ngOnInit(): void {
    const localData = localStorage.getItem('signUpUsers');
    if (localData) {
      this.signupUsers = JSON.parse(localData);
    }
  }

  onLogin() {
    const isUserExist = this.signupUsers.find(user => user.email === this.loginObj.email && user.password === this.loginObj.password);
    if (isUserExist) {
      alert('Connexion réussie');
      // Sauvegarder l'utilisateur connecté dans le local storage
      localStorage.setItem('currentUser', JSON.stringify(isUserExist));
      // Rediriger vers une autre page si nécessaire
    } else {
      alert('Mauvais identifiants');
    }
  }
}
