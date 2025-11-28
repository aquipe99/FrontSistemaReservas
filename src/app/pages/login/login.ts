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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule,],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  email = '';
  password = '';
  checked: boolean = false;

  constructor( private auth: Auth,private router: Router  ) {}
  onSubmit() {

    const payload: LoginRequest = {
      email: this.email,
      password: this.password
    };
debugger;
    this.auth.login(payload).subscribe({
      next: (res) => {
        debugger;
        this.auth.saveSession(res.token, res.user);
        this.router.navigate(['/inicio']);
      },
      error: () => alert('Credenciales inválidas')
    });
  }
}
