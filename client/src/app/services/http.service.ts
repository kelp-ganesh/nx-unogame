import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISignInRequest, ISigninResponse, ISignUpRequest, ISignUpResponse } from '@unogame/shared-lib';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  onSignup({ name, email, password, avatarId }: ISignUpRequest): Observable<ISignUpResponse> {
    return this.http.post<ISignUpResponse>(`${this.apiUrl}/auth/signup`, {
      name,
      email,
      password,
      avatarId,
    });
  }

  onSignin({ email, password }: ISignInRequest): Observable<ISigninResponse> {
    return this.http.post<ISigninResponse>(
      `${this.apiUrl}/auth/login`,
      { email, password },
      { withCredentials: true },
    );
  }
}
