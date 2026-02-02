import { Component, inject, signal, OnDestroy } from '@angular/core';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { ISignUpResponse } from '@unogame/shared-lib';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, Toast],
  templateUrl: './signup.html',
  styleUrls: [],
})
export class SignupComponent implements OnDestroy {
  private readonly authService = inject(LoginService);
  private readonly messageService = inject(MessageService);
  private readonly routerLink = inject(Router);
  private signUpResponseSub: Subscription;

  selectedAvatarSeed = signal<number>(1);

  signupForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
  });

  ngOnDestroy() {
    if (this.signUpResponseSub) {
      this.signUpResponseSub.unsubscribe();
    }
  }

  async onSubmit(): Promise<void> {
    if (this.signupForm.valid) {
      const payload = {
        ...this.signupForm.value,
      };
      try {
        const res: ISignUpResponse = await this.authService.onSignup({
          name: payload.username,
          email: payload.email,
          password: payload.password,
          avatarId: this.selectedAvatarSeed().toString(),
        });

        if (res.status) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Signup Successful',
          });
          this.routerLink.navigate(['/signin']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.desc,
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
}
