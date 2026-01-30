import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import {
  ISignInRequest,
  ISigninResponse,
  ISignUpRequest,
  ISignUpResponse,
} from '@unogame/shared-lib';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly http = inject(HttpClient);

  onSignup({
    name,
    email,
    password,
    avatarId,
  }: ISignUpRequest): Promise<ISignUpResponse> {
    return lastValueFrom(
      this.http.post<ISignUpResponse>(`api/auth/signup`, {
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
        `api/auth/login`,
        { email, password },
        { withCredentials: true },
      ),
    );
  }
}
