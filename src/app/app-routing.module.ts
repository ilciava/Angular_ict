import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ClientiComponent } from './clienti/clienti.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'cliente', component: ClientiComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
