import { Component } from '@angular/core';
import { Auth } from '../../core/services/auth/auth';
import { Router, RouterModule } from '@angular/router';
import { LoginRequest } from '../../core/models/login-request';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule,MessageModule,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = '';
  password = '';
  checked: boolean = false;

   errors: any = {
    email: null,
    password: null,
    general: null
  };

  constructor( private auth: Auth,private router: Router  ) {}

  clearError(field: string) {
    // cuando el usuario escribe, desaparece el mensaje
    this.errors[field] = null;
    this.errors.general = null;
  }

  onSubmit() {

     this.errors = { email: null, password: null, general: null };

    if (!this.email) this.errors.email = 'El email' ;
    if (!this.password) this.errors.password = 'La contraseña ';

      if (this.errors.email || this.errors.password) {
      return;
    }
    const payload: LoginRequest = {
      email: this.email,
      password: this.password
    };


    this.auth.login(payload).subscribe({
      next: (res) => {
        this.auth.saveSession(res.token, res.user);
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
      console.log("Error backend:", err);

        if (err.error?.codigo === 400 && err.error.data) {
          this.errors.email = err.error.data.email || null;
          this.errors.password = err.error.data.password || null;
        }      
        if (err.error?.codigo === 401) {
          this.errors.general = err.error.mensaje;
        }
      }
    });
  }
}
