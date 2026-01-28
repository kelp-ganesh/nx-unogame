import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpService } from '../../services/http.service';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { ISigninResponse } from '@unogame/shared-lib';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, Toast],
  templateUrl: './signin.html',
  styleUrls: [],
})
export class SigninComponent implements OnDestroy {
  private readonly authService = inject(HttpService);
  private readonly messageService = inject(MessageService);
  private readonly routerLink = inject(Router);
  private signInResponseSub: Subscription;

  ngOnDestroy() {
    if (this.signInResponseSub) {
      this.signInResponseSub.unsubscribe();
    }
  }

  signinForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  onSubmit() {
    if (this.signinForm.valid) {
      const payload = {
        ...this.signinForm.value,
      };
      this.signInResponseSub = this.authService
        .onSignin({ email: payload.email!, password: payload.password! })
        .subscribe({
          next: (res: ISigninResponse) => {
            // Store token in localStorage
            if (res.status == true) {
              localStorage.setItem('authToken', res.access_token);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Signin Successful',
              });
              setTimeout(() => {
                this.routerLink.navigate(['/lobby']);
              }, 1500);
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: res.msg });
            }
          },
          error: (err) => {
            console.error('Signin Failed:', err.message);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Signin Failed',
            });
          },
        });
    }
  }
}
