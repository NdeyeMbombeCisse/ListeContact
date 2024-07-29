
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Déclaration de l'interface Contact
interface Contact {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  etat: string;
  createdAt: Date;
  createdBy: string; // Identifiant de l'utilisateur
  updatedAt: Date;
  updatedBy: string;
  description: string;
}

// Le décorateur
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'] // Correction du nom du fichier CSS
})
// La classe ContactComponent
export class ContactComponent implements OnInit {

  constructor(private router: Router) {}

  // Déclaration de tableau de contacts de type interface
  contacts: Contact[] = [];

  // Déclaration du tableau trash qui permet de stocker les éléments supprimés
  trash: Contact[] = [];

  // Déclaration de la variable searchTerm qui permet de stocker le terme de recherche
  searchTerm: string = '';

  // Variable qui permet de vérifier si le popup pour l'ajout est ouvert ou pas
  isAddContactPopupOpen: boolean = false;

  // Variable qui permet de vérifier si le popup qui affiche la corbeille est ouverte ou pas
  isTrashPopupOpen: boolean = false;

  // Variable qui stock l'id du contact à modifier
  editingContactId: number | null = null;

  // Modèle qui permet d'initialiser les données d'un contact
  contact: Contact = {
    id: 0,
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    etat: 'active',
    createdAt: new Date(),
    createdBy: '', // Initialisé comme une chaîne vide, mis à jour plus tard
    updatedAt: new Date(),
    updatedBy: '',
    description: ''
  };

  ngOnInit(): void {
    this.loadContacts();
  }

  // Méthode qui permet de charger les données depuis le localStorage
  loadContacts() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.id; // Assurez-vous que `currentUser` contient l'id de l'utilisateur

    if (userId) {
      this.contacts = JSON.parse(localStorage.getItem('contacts') || '[]').filter((contact: Contact) =>
        contact.createdBy === userId // Filtrer les contacts en fonction de l'utilisateur
      );
      this.trash = JSON.parse(localStorage.getItem('trash') || '[]').filter((contact: Contact) =>
        contact.createdBy === userId // Filtrer également les contacts dans la corbeille
      );
    } else {
      this.contacts = [];
      this.trash = [];
    }
  }

  onLogout() {
    localStorage.removeItem('currentUser');
    alert('Déconnexion réussie');
    this.router.navigate(['/login']); // Rediriger vers la page de connexion
  }

  // Méthode qui gère l'ajout ou la modification d'un contact
  addContact() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.id;

    if (currentUser ) {
      if (this.editingContactId !== null) {
        const index = this.contacts.findIndex(c => c.id === this.editingContactId);
        if (index !== -1) {
          this.contact.updatedAt = new Date();
          this.contact.updatedBy = userId;
          this.contacts[index] = this.contact;
        }
      } else {
        this.contact.id = new Date().getTime();
        this.contact.createdAt = new Date();
        this.contact.updatedAt = new Date();
        this.contact.createdBy = userId;
        this.contacts.push(this.contact);
      }
      localStorage.setItem('contacts', JSON.stringify(this.contacts));
      alert('Contact ajouté ou modifié avec succès');
      this.resetForm();
      this.closeAddContactPopup();
    } else {
      alert('Utilisateur non connecté');
    }
  }

  // Réinitialisation de l'objet contact
  resetForm() {
    this.contact = {
      id: 0,
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      etat: 'active',
      createdAt: new Date(),
      createdBy: '', // Réinitialisé comme une chaîne vide
      updatedAt: new Date(),
      updatedBy: '',
      description: ''
    };
    this.editingContactId = null;
  }

  // Méthode qui permet de supprimer un contact
  deleteContact(contactId: number) {
    const contactIndex = this.contacts.findIndex(contact => contact.id === contactId);
    if (contactIndex !== -1) {
      this.trash.push(this.contacts[contactIndex]);
      localStorage.setItem('trash', JSON.stringify(this.trash));
      this.contacts.splice(contactIndex, 1);
      localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }
  }

  // Méthode pour restaurer un contact à partir de la corbeille
  restoreContact(contactId: number) {
    const contactIndex = this.trash.findIndex(contact => contact.id === contactId);
    if (contactIndex !== -1) {
      this.contacts.push(this.trash[contactIndex]);
      localStorage.setItem('contacts', JSON.stringify(this.contacts));
      this.trash.splice(contactIndex, 1);
      localStorage.setItem('trash', JSON.stringify(this.trash));
    }
  }

  viewDetails(contactId: number) {
    const contact = this.contacts.find(contact => contact.id === contactId);
    if (contact) {
      alert(`Détails du contact:\nNom: ${contact.nom}\nPrénom: ${contact.prenom}\nEmail: ${contact.email}\nTéléphone: ${contact.telephone}\nDescription: ${contact.description}`);
    }
  }

  // Méthode pour préparer un contact existant à être modifié
  editContact(contactId: number) {
    const contact = this.contacts.find(contact => contact.id === contactId);
    if (contact) {
      this.contact = { ...contact };
      this.editingContactId = contactId;
      this.openAddContactPopup();
    }
  }

  // Méthode pour filtrer les contacts en fonction d'un terme de recherche
  searchContacts() {
    const term = this.searchTerm.toLowerCase();
    this.contacts = JSON.parse(localStorage.getItem('contacts') || '[]').filter((contact: Contact) =>
      contact.nom.toLowerCase().includes(term) || contact.telephone.includes(term)
    ).filter((contact: Contact) =>
      contact.createdBy === JSON.parse(localStorage.getItem('currentUser') || '{}').id
    );
  }

  openAddContactPopup() {
    this.isAddContactPopupOpen = true;
  }

  closeAddContactPopup() {
    this.isAddContactPopupOpen = false;
  }

  openTrashPopup() {
    this.isTrashPopupOpen = true;
  }

  closeTrashPopup() {
    this.isTrashPopupOpen = false;
  }
}
