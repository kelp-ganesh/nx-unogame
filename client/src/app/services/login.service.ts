import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, lastValueFrom } from 'rxjs';
import {
  ISignInRequest,
  ISigninResponse,
  ISignUpRequest,
  ISignUpResponse,
} from '@unogame/shared-lib';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  onSignup({
    name,
    email,
    password,
    avatarId,
  }: ISignUpRequest): Promise<ISignUpResponse> {
    return lastValueFrom(
      this.http.post<ISignUpResponse>(`${this.apiUrl}/auth/signup`, {
        name,
        email,
        password,
        avatarId,
      }),
    );
  }

  onSignin({ email, password }: ISignInRequest): Promise<ISigninResponse> {
    return lastValueFrom(
      this.http.post<ISigninResponse>(
        `${this.apiUrl}/auth/login`,
        { email, password },
        { withCredentials: true },
      ),
    );
  }
}
