import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Client, ClientService } from '../client.service';

@Component({
  selector: 'app-clienti',
  templateUrl: './clienti.component.html',
  styleUrl: './clienti.component.css'
})
export class ClientiComponent implements OnInit{

  displayedColumns: string[] = ['id','nome', 'cognome', 'email', 'edit', 'delete'];

  clienti: Client[]= []; 
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
    this.isvisible =!this.isvisible;
  }

  getClient(): void {
    let id = sessionStorage.getItem('userId');
    this.clientService.getClientsById(parseInt(id as string)).subscribe({
      next: (clients) => {
        this.clienti = clients;

      },
      error: (error) => {
        console.error('errore recupero clienti', error);
      }
    });
  }

  onEdit(clienti: Client): void {
    this.isvisible=true;
    this.userForm.patchValue({
    nome: clienti.nome,
    cognome: clienti.cognome,
    email: clienti.email
    });
    this.selectedClientId = clienti.id !== undefined ? clienti.id : null;
  }
  editCliente(cliente: any) {
    this.clienteSelezionato = cliente;
    this.editForm.setValue({
      nome: cliente.nome,
      cognome: cliente.cognome,
      email: cliente.email
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
          let id = sessionStorage.getItem('userId');
          const cliente: Client = { ...this.userForm.value, userId: id };
          this.clientService.addClient(cliente).subscribe({
            next: (response) => {
              this.getClient();
            },
            error: (error) => {
              console.error('Errore aggiunta cliente', error);
            }
          });
        } else {
          let userId = sessionStorage.getItem('userId');
          const cliente = { ...this.userForm.value, userId: userId, id: this.selectedClientId };
          this.clientService.updateClient(cliente).subscribe({
            next: (response) => {
              this.getClient();
              this.selectedClientId = null;
            },
            error: (error) => {
              console.error("Errore durante l'aggiornamento del cliente:", error);
            }
          });
        }
    }
}

