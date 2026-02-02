import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ISigninResponse } from '@unogame/shared-lib';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, Toast],
  templateUrl: './signin.html',
  styleUrls: [],
})
export class SigninComponent {
  private readonly authService = inject(LoginService);
  private readonly messageService = inject(MessageService);
  private readonly routerLink = inject(Router);

  signinForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  async onSubmit(): Promise<void> {
    if (!this.signinForm.valid) return;

    const { email, password } = this.signinForm.value as {
      email?: string;
      password?: string;
    };

    try {
      const res: ISigninResponse = await this.authService.onSignin({
        email: email,
        password: password,
      });

      if (res.status === true) {
        localStorage.setItem('authToken', res.accessToken);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Signin Successful',
        });
       this.routerLink.navigate(['/lobby']);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: res.msg,
        });
      }
    } catch (err) {
      console.error('Signin Failed:', err.message);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Signin Failed',
      });
    }
  }
}
