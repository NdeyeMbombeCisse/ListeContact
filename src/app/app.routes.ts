import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ContactComponent } from './contact/contact.component';



export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'contacts', component: ContactComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
  ];

  @NgModule({
    // imports: [RouterModule.forRoot(routes)],
    // exports: [RouterModule]

    imports: [
        RouterModule.forRoot(routes, { useHash: true }),
      ],
      exports: [
        RouterModule
      ]
     
    
  })

  export class AppRoutingModule { }

  