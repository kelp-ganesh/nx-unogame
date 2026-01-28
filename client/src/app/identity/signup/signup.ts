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
import { HttpService } from '../../services/http.service';
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
  private readonly authService = inject(HttpService);
  private readonly messageService = inject(MessageService);
  private readonly routerLink = inject(Router);
  private signUpResponseSub: Subscription;

  selectedAvatarSeed = signal<number>(1);

  ngOnDestroy() {
    if (this.signUpResponseSub) {
      this.signUpResponseSub.unsubscribe();
    }
  }

  signupForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit() {
    if (this.signupForm.valid) {
      const payload = {
        ...this.signupForm.value,
      };

      this.signUpResponseSub = this.authService
        .onSignup({
          name: payload.username!,
          email: payload.email!,
          password: payload.password!,
          avatarId: this.selectedAvatarSeed().toString(),
        })
        .subscribe({
          next: (res: ISignUpResponse) => {
            if (res.status) {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Signup Successful',
              });
              setTimeout(() => {
                this.routerLink.navigate(['/signin']);
              }, 1500);
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: res.desc });
            }
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: err.message,
            });
          },
        });
    }
  }
}
