import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ViewChild, ElementRef } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserAuthLogin } from '../../interfaces/user-auth-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  @ViewChild('email') email!: ElementRef<HTMLInputElement>;
  @ViewChild('password') password!: ElementRef<HTMLInputElement>;
  error = '';
  constructor(private authService: AuthService, private router: Router) { }

  //Login form for validators
  loginForm = new FormGroup({
    login: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
    ]),
  });


  onSubmit() {
    if (this.loginForm.valid) {
      const loginData: UserAuthLogin = {
        username: this.loginForm.value.login!, // L'opérateur '!' indique que 'email' et 'password' ne sont pas null ni undefined
        password: this.loginForm.value.password!,
      };
      this.authService.login(loginData).subscribe({
        // this.error = '';
        // Envoyer les données au backend
        next: (user) => {
          console.log('Connexion réussie:', user);
          this.router.navigate(['/fr/panel']);
        },
        error: (error) => {
          console.error('Erreur de connexion:', error);

          switch (error.status) {
            case 0:
              this.error = 'Serveur injoignable';
              break;
            case 403:
              this.error = 'Login ou mot de passe incorrect';
              break;
            default:
              this.error = 'Erreur interne du serveur';
              break;
          }
        },
      });

    }
  }
}