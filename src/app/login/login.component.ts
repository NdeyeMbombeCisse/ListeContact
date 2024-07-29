
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  showSignup = false; // État pour afficher ou masquer le formulaire d'inscription

  loginObj: any = {
    email: "",
    password: "",
  };

  signupObj: any = {
    email: "",
    password: "",
  };

  signupUsers: any[] = []; // Tableau pour stocker les utilisateurs inscrits

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Chargement des utilisateurs inscrits depuis le stockage local
    const localData = localStorage.getItem('signUpUsers');
    if (localData) {
      this.signupUsers = JSON.parse(localData);
    }
  }

  onSignup() {
    // Vérifie si l'utilisateur existe déjà
    const isUserExist = this.signupUsers.find(user => user.email === this.signupObj.email);
    if (isUserExist) {
      alert('Utilisateur déjà existant');
    } else {
      // Ajoute le nouvel utilisateur et met à jour le stockage local
      this.signupUsers.push(this.signupObj);
      localStorage.setItem('signUpUsers', JSON.stringify(this.signupUsers));
      alert('Inscription réussie');
      this.signupObj = { email: "", password: "" }; // Réinitialiser le formulaire d'inscription
    }
  }

  onLogin() {
    // Vérifie les identifiants de connexion
    const isUserExist = this.signupUsers.find(user => user.email === this.loginObj.email && user.password === this.loginObj.password);
    if (isUserExist) {
      alert('Connexion réussie');
      // Enregistre les informations de l'utilisateur connecté
      localStorage.setItem('currentUser', JSON.stringify(isUserExist));
      
      this.router.navigate(['/contacts']); // Redirection après connexion
    } else {
      alert('Mauvais identifiants');
    }
  }

  onLogout() {
    // Supprime les informations de l'utilisateur connecté
    localStorage.removeItem('currentUser');
    alert('Déconnexion réussie');
    this.router.navigate(['/login']); // Redirection après déconnexion
  }

  toggleForm() {
    // Bascule entre les formulaires de connexion et d'inscription
    this.showSignup = !this.showSignup;
  }

  isLoggedIn(): boolean {
    // Vérifie si un utilisateur est connecté
    return !!localStorage.getItem('currentUser');
  }
}
