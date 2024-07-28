


import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  contacts: Contact[] = [];
  trash: Contact[] = [];
  editingContactId: number | null = null;
  searchTerm: string = '';

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

  loadContacts() {
    this.contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    this.trash = JSON.parse(localStorage.getItem('trash') || '[]');
  }

  addContact() {
    if (this.editingContactId !== null) {
      const contactIndex = this.contacts.findIndex(contact => contact.id === this.editingContactId);
      if (contactIndex !== -1) {
        this.contact.updatedAt = new Date();
        this.contacts[contactIndex] = { ...this.contact };
      }
      alert('Contact modifié avec succès');
    } else {
      this.contact.id = new Date().getTime();
      this.contact.createdAt = new Date();
      this.contact.updatedAt = new Date();
      this.contacts.push(this.contact);
      alert('Contact ajouté avec succès');
    }

    localStorage.setItem('contacts', JSON.stringify(this.contacts));
    this.resetForm();
  }

  editContact(contactId: number) {
    const contact = this.contacts.find(contact => contact.id === contactId);
    if (contact) {
      this.contact = { ...contact };
      this.editingContactId = contactId;
    }
  }

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

  deleteContact(contactId: number) {
    const contactIndex = this.contacts.findIndex(contact => contact.id === contactId);
    if (contactIndex !== -1) {
      this.trash.push(this.contacts[contactIndex]);
      localStorage.setItem('trash', JSON.stringify(this.trash));
      this.contacts.splice(contactIndex, 1);
      localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }
  }

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

  searchContacts() {
    if (this.searchTerm.trim() === '') {
      this.loadContacts();
    } else {
      this.contacts = this.contacts.filter(contact =>
        contact.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        contact.telephone.includes(this.searchTerm)
      );
    }
  }
}
