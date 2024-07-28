

import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// declration de l'interface conctact
interface Contact {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  etat: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  description: string;
}
// le decorateur
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
// la class ContactComponent
export class ContactComponent implements OnInit {
  // delcration de tableau de contact de type interface
  contacts: Contact[] = [];

  // declaration du tableau trash qui permet de stocker les elements supprimer
  trash: Contact[] = [];

  // declaration de la variable searchTerm qui permet de stocker les terme de recherche
  searchTerm: string = '';

// variable qui permet de verifier si le popup pour l'ajout est ouvert ou pas
  isAddContactPopupOpen: boolean = false;
  // variable qui permet de verifier si le popup qui affiche la corbeille est ouverte ou pas
  isTrashPopupOpen: boolean = false;

  // variable qui stock l'id du contact a modifier
  editingContactId: number | null = null;

  // model qui permet d'initialiser les donnees d'un contact
  contact: Contact = {
    id: 0,
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    etat: 'active',
    createdAt: new Date(),
    createdBy: 'user',
    updatedAt: new Date(),
    updatedBy: 'user',
    description: ''
  };

  ngOnInit(): void {
    this.loadContacts();
  }
// methode qui permet de charger les donnees depuis le localstorage
  loadContacts() {
    this.contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    this.trash = JSON.parse(localStorage.getItem('trash') || '[]');
  }
// methode qui gere l'ajout ou la modification d'un contact
  addContact() {
    // verifier si la variable qui contient les id n'est pas null
    if (this.editingContactId !== null) {
      // recherche de l'id du conatct dans le taleau contacts
      const index = this.contacts.findIndex(c => c.id === this.editingContactId);
      // verifie si l'id trouve est valid
      if (index !== -1) {
        // si oui on met a jour la date modifcation
        this.contact.updatedAt = new Date();
        // le user qui a modifie
        this.contact.updatedBy = 'user';
        // on remplace les anciens donnees par les nouvelles donnes 
        this.contacts[index] = this.contact;
      }
            // si la variable qui stocke l'id de modification est vide on ajoute un nveau contact
    } else {
      // Attribue un nouvel ID unique au contact en utilisant le timestamp actuel
      this.contact.id = new Date().getTime();
      // definition de la date de creation
      this.contact.createdAt = new Date();
      this.contact.updatedAt = new Date();
      // Ajoute le nouveau contact au tableau contacts.
      this.contacts.push(this.contact);
    }
    // Convertion du tableau contacts en une chaîne JSON et l'enregistre dans le local storage du navigateur sous la clé 'contacts'. Cela permet de conserver les contacts même après le rechargement de la page.
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
    alert('Contact ajouté ou modifié avec succès');
    // méthode pour réinitialiser le formulaire de contact 
    this.resetForm();
    //  méthode pour fermer le popup d'ajout ou de modification du contact.
    this.closeAddContactPopup();
  }
  // Réinitialisation de l'objet contact :
  resetForm() {
    this.contact = {
      id: 0,
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      etat: 'active',
      createdAt: new Date(),
      createdBy: 'user',
      updatedAt: new Date(),
      updatedBy: 'user',
      description: ''
    };
    this.editingContactId = null;
  }

  // methode qui permet de supprimer un contact
  deleteContact(contactId: number) {
    // recherche de l'index du contact dans le tableau contacts
    const contactIndex = this.contacts.findIndex(contact => contact.id === contactId);
    // verifi si l'index trouve est valide
    if (contactIndex !== -1) {
      // effectue l'action de déplacer un contact de la liste des contacts vers la corbeille 
      this.trash.push(this.contacts[contactIndex]);
      // Met à jour le stockage local avec le tableau trash mis à jour en le convertissant en chaîne JSON
      localStorage.setItem('trash', JSON.stringify(this.trash));
      // Supprime le contact à l'index contactIndex du tableau contacts. La méthode splice() modifie le tableau en supprimant un élément à l'index spécifié.
      this.contacts.splice(contactIndex, 1);
      // mis à jour, après la suppression du contact
      localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }
  }
// methode pour restaurer un contact à partir de la corbeille 
  restoreContact(contactId: number) {
    // Recherche de l'Index du Contact dans la Corbeille :
    const contactIndex = this.trash.findIndex(contact => contact.id === contactId);
    // si l'id est valid
    if (contactIndex !== -1) {
      //  Ajout du contact trouvé dans trash à la liste principale contacts
      this.contacts.push(this.trash[contactIndex]);
      // Met à jour le stockage local avec le tableau contacts
      localStorage.setItem('contacts', JSON.stringify(this.contacts));
      // Supprime le contact à l'index contactIndex du tableau trash
      this.trash.splice(contactIndex, 1);
      // mis à jour, après la suppression du contact restauré.
      localStorage.setItem('trash', JSON.stringify(this.trash));
    }
  }

  viewDetails(contactId: number) {
        // Recherche de l'Index du Contact dans la Corbeille :
    const contact = this.contacts.find(contact => contact.id === contactId);
    if (contact) {
      alert(`Détails du contact:\nNom: ${contact.nom}\nPrénom: ${contact.prenom}\nEmail: ${contact.email}\nTéléphone: ${contact.telephone}\nDescription: ${contact.description}`);
    }
  }
// methode pour préparer un contact existant à être modifié
  editContact(contactId: number) {
        // Recherche de l'Index du Contact dans la Corbeille :
    const contact = this.contacts.find(contact => contact.id === contactId);
    if (contact) {
      // prépare l'objet this.contact avec les données du contact que l'utilisateur souhaite modifier,
      this.contact = { ...contact };
      // attribution de la variable qui contient l'id de la mododification a l'id du contact a modifier
      this.editingContactId = contactId;
      // methode pour l'ouvertur du popup pour la modification
      this.openAddContactPopup();
    }
  }
  // methode pour  filtrer les contacts en fonction d'un terme de recherche 
  searchContacts() {
    // Transformation du Terme de Recherche en Minuscules :
    const term = this.searchTerm.toLowerCase();
    // Chargement des Contacts depuis le Stockage Local et Filtrage :
    this.contacts = JSON.parse(localStorage.getItem('contacts') || '[]').filter((contact: Contact) =>
      contact.nom.toLowerCase().includes(term) || contact.telephone.includes(term)
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
