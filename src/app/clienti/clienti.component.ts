import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Client, ClientService } from '../client.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-clienti',
  templateUrl: './clienti.component.html',
  styleUrl: './clienti.component.css'
})
export class ClientiComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nome', 'cognome', 'email', 'edit', 'delete'];

  clienti: Client[] = [];
  clienteSelezionato: any;
  editForm: any;

  isvisible: boolean = false;
  selectedClientId: number | null = null;

  userForm: FormGroup;
  
  constructor(private clientService: ClientService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getClient();
  }

  show(): void {
    this.isvisible = !this.isvisible;
  }

  getClient(): void {
    let id = sessionStorage.getItem('userId');
    this.clientService.getClientsById(parseInt(id as string)).subscribe({
      next: (clients) => {
        this.clienti = clients;
      },
      error: (error: any) => {
        console.error('Errore recupero clienti', error);
      }
    });
  }

  onEdit(clienti: Client): void {
    this.isvisible = true;
    this.userForm.patchValue({
      nome: clienti.nome,
      cognome: clienti.cognome,
      email: clienti.email
    });
    this.selectedClientId = clienti.id !== undefined ? clienti.id : null;
  }

  onDelete(id: number): void {
    this.clientService.deleteClient(id).subscribe({
      next: () => {
        this.clienti = this.clienti.filter(c => c.id !== id);
        console.log(`Cliente con id ${id} cancellato con successo`);
      },
      error: (error: any) => {
        console.error('Errore durante la cancellazione del cliente', error);
      }
    });
  }
  

  onSubmit(): void {
    if (this.selectedClientId === null) {
      let id = sessionStorage.getItem('userId');
      const cliente: Client = { ...this.userForm.value, userId: id };
      this.clientService.addClient(cliente).subscribe({
        next: () => {
          this.getClient();
          this.resetForm();  // Resetta il form e lo nasconde dopo l'aggiunta
        },
        error: (error: any) => {
          console.error('Errore aggiunta cliente', error);
        }
      });
    } else {
      let userId = sessionStorage.getItem('userId');
      const cliente = { ...this.userForm.value, userId: userId, id: this.selectedClientId };
      this.clientService.updateClient(cliente).subscribe({
        next: () => {
          this.getClient();
          this.selectedClientId = null;
          this.resetForm();  // Resetta il form e lo nasconde dopo la modifica
        },
        error: (error: any) => {
          console.error("Errore durante l'aggiornamento del cliente:", error);
        }
      });
    }
  }
  
  // Metodo per resettare il form e nasconderlo
  resetForm(): void {
    this.userForm.reset();    
    this.isvisible = false;   
  }
}
