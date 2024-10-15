import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { subscribeOn } from 'rxjs';
import { Client, ClientService } from '../client.service';
import { User } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {

  username: string = '';
  password: string = '';
  
  form: FormGroup | undefined;
  loginForm: any;

  constructor(private clientService: ClientService, private router: Router, private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  printValues(): void {
    console.log('Username:', this.username);
    console.log('Password:', this.password);
  }

  onSubmit(): void {
    /*
     this.authService.getUsers().subscribe({
      next: (users: any[]) => {
        console.log('Users:', users);
      },
      error: (err) => {
        console.log('Errore del server', err);
      },
      complete: () => {
        console.log(' Chiamata completata.');
      }
    }); 
    */
    
    if(this.loginForm.valid) {
      const username = this.loginForm.get('username')?.value;
      const password = this.loginForm.get('password')?.value;

      this.authService.authenticate(username, password).subscribe({
        next: (user) => {
          if(user) {
            sessionStorage.setItem('userId', user.id.toString());
            this.router.navigate(['/cliente']);
          } else {
            alert('Credenziali non valide');
          }
          error: (err: any) => {
            console.error('errore del server', err);
          }
        }
      });
    }
  }
}
